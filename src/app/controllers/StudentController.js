const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectsregister, projectstudents, projectadvisors, projectfiles, files, progress } = models;

class StudentController {
    //[GET] /student
    //---Giao diện trang chủ sinh viên /dashboard
    async dashboard(req, res, next) {
        try {
            const user_id = req.session.user.id;
            const role = req.session.user.role;
            // Truy vấn dữ liệu----------------------------
            const student = await students.findOne({
                where: { usersID: user_id },
                include: [
                    { model: majors, as: 'major', attributes: ['name'] },
                    { model: class_, as: 'class', attributes: ['classID'] },
                    // { model: files, as: 'files', attributes: ['file_path']},
                ],
                attributes: ['studentID', 'lastname', 'firstname', 'date_of_birth', 'gender'],
            });
            const project = await projects.findAll({
                include: [
                    {
                        model: projectstudents, as: 'projectstudents', attributes: [], required: true,
                        include: [{
                            model: students, as: 'student',
                            attributes: ['studentID', 'lastname', 'firstname', 'date_of_birth', 'gender'],
                            where: { usersID: user_id },
                        }],
                    },
                    {
                        model: projectadvisors, as: 'projectadvisors', attributes: ['advisor_id'],
                        include: [{
                            model: advisors, as: 'advisor',
                            attributes: ['lastname', 'firstname']
                        }],
                    },
                    {
                        model: projectsregister, as: 'projectsregister', attributes: ['project_id', 'status', 'note']
                    }
                ],
                attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'status']
            });
            console.log(JSON.stringify(project, null, 2));
            // ---------------------------------------------
            if (!student) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Student not found',
                });
            }
            const student_data = student.toJSON();
            // const project_data = project.toJSON();
            res.render('roles/student/dashboard', {
                title: 'Trang chủ',
                data: student_data,
                project_data: project,
                dashboardactive: true,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                role: role,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }
    //---Giao diện đăng ký đề tài /register-topic
    async registerTopic(req, res, next) {
        try {
            const role = req.session.user.role;
            const major = await majors.findAll();
            const advisor = await advisors.findAll();

            res.render('roles/student/register-topic', {
                title: 'Thêm mới đề tài',
                major: major,
                advisors: advisor,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                role: role,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }
    //[POST] /student
    //---Chức năng đăng ký đề tài /register-topic 
    async createTopic(req, res, next) {
        const data = req.body;
        console.log('Data received:', data);

        const studentlist = Array.isArray(data.students) ? data.students : [];
        console.log(studentlist);
        const dateProject = new Date();

        const transaction = await sequelize.transaction();
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!data.title || !data.description || !data.majorId) {
                throw new Error('Thiếu thông tin bắt buộc');
            }

            // Thêm dữ liệu vào bảng project
            const project = await projects.create({
                title: data.title,
                description: data.description,
                status: data.status,
                majorID: data.majorId,
                start_date: data.status === 'in_progress' ? dateProject : null
            }, { transaction });

            try {
                for (const studentId of studentlist) {
                    const existingProject = await projectstudents.findOne({
                        where: { student_id: studentId },
                        include: [
                            {
                                model: projects,
                                as: 'project',
                                where: {
                                    status: ['not_started', 'in_progress'],
                                },
                            },
                            {
                                model: students,
                                as: 'student',
                                where: {
                                    id: studentId,
                                },
                                attributes: ['studentID', 'lastname', 'firstname'],
                            },
                        ],
                    });

                    console.log(existingProject);

                    if (existingProject) {
                        // Nếu sinh viên đã tham gia dự án khác với trạng thái not_started hoặc in_progress
                        const { studentID, lastname, firstname } = existingProject.student;
                        res.status(400).send({ message: `Sinh viên ${studentID} - ${lastname} ${firstname} đã tham gia một dự án khác. Vui lòng kiểm tra lại!` });
                        return; // Dừng quá trình nếu có lỗi
                    }

                    // Nếu không có lỗi, tiếp tục thêm sinh viên vào dự án
                    await projectstudents.create({
                        project_id: project.id,
                        student_id: studentId,
                    }, { transaction });
                }
            } catch (error) {
                console.error('Lỗi khi xử lý sinh viên:', error.message);
                // Trong trường hợp có lỗi, rollback giao dịch
                await transaction.rollback();
                res.status(500).send({ message: 'Lỗi hệ thống. Vui lòng thử lại!' });
                return;
            }

            // Thêm giảng viên hướng dẫn nếu có
            if (data.advisorId) {
                await projectadvisors.create({
                    project_id: project.id,
                    advisor_id: data.advisorId
                }, { transaction });
            }

            // Thêm dữ liệu vào bảng projectsregister
            await projectsregister.create({
                project_id: project.id,
                status: 'pending', // Trạng thái mặc định
                note: data.note || null, // Ghi chú tùy chọn
            }, { transaction });

            await transaction.commit();
            res.status(200).send({ message: 'Tạo đề tài thành công, vui lòng kiểm tra lại tại trang danh sách' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating project or students:', error);
            res.status(400).send({ message: error.message || 'Lỗi khi tạo dự án' });
        }
    }
    //[DELETE] /student
    //---Chức năng xóa thông tin đề tài không được duyệt /delete-topic/:id
    async deleteTopic(req, res, next) {
        const { projectId } = req.params;

        try {
            // Xóa đề tài
            const deleteCount = await projects.destroy({
                where: { id: projectId },
            });

            if (deleteCount === 0) {
                return res.status(404).json({ message: 'Không tìm thấy đề tài cần xóa.' });
            }

            res.status(200).json({ message: 'Đã xóa đề tài thành công.' });
        } catch (error) {
            console.error('Lỗi khi xóa đề tài:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa đề tài.' });
        }
    }




    //[POST]
    async addProgress(req, res, next) {
        const title = req.body.title;
        const projectid = req.body.projectid;
        try {
            await progress.create({
                title: title,
                content: '',
                project_id: projectid
            })
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
        }
    }
    //[DELETE]
    async deleteProgress(req, res, next) {
        const id = req.params.progressid;
        console.log(id);
        try {
            await progress.destroy({
                where: { id: id }
            });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
        }
    }
    //[PUT]
    async updateProgress(req, res, next) {
        const { Id } = req.params;
        const title = req.body.title;
        const content = req.body.content;
        try {
            await progress.update({
                title: title,
                content: content,
            }, {
                where: { id: Id }
            });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi' });
        }
    }
}
module.exports = new StudentController();