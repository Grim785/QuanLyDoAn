const bcrypt = require('bcrypt'); //Import mã hóa mật khẩu
const { where, Op } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents, projectadvisors } = models;
class AdminController {
    //[GET] /admin/dashboard
    dashboard(req, res, next) {
        res.render('roles/admin/TopicDetails', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            dashboardactive: true,
        });
    }
    //[GET] /admin/AccountManagement
    async AccountManagement(req, res, next) {
        try {
            const listUsers = await users.findAll({
                include: [
                    { model: students, as: 'students', attributes: ['lastname', 'firstname'] },
                    { model: advisors, as: 'advisors', attributes: ['lastname', 'firstname'] }
                ],
                attributes: ['id', 'username', 'role', 'active', 'createdAt', 'updatedAt']
            });
            // console.log(JSON.stringify(listUsers, null, 2)); 
            res.render('roles/admin/AccountManagement', {
                title: 'Danh sách tài khoản',
                listUsers: listUsers,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                admin: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }

    AdvisorList(req, res, next) {
        res.render('roles/admin/AdvisorList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            advisorlistactive: true,
        });
    }

    async loadcreateToppic(req, res, next) {
        try {
            const major = await majors.findAll();
            const advisor = await advisors.findAll();

            res.render('roles/admin/create-new-topic', {
                title: 'Thêm mới đề tài',
                major: major,
                advisors: advisor,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                admin: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }

    }
    async searchStudents(req, res, next) {
        try {
            // Lấy query từ fontend -------------------
            const query = req.query.query;
            if (!query) {
                return res.status(400).json({ message: 'Yêu cầu tìm kiếm không hợp lệ' });
            }
            // Tìm sinh viên------------------------------------
            const results = await students.findAll({
                where: {
                    studentID: {
                        [Op.like]: `%${query}%`
                    }
                },
                attributes: ['id', 'studentID', 'lastname', 'firstname']
            });
            res.json(results);
        } catch (error) {
            console.log(error);
        }
    }
    async userDetail(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await users.findOne({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).render('error', { message: 'Tài khoản không tồn tại' });
            }

            if (user.role === 'student') {
                const student = await students.findOne({ where: { usersID: userId } })
                res.render('roles/admin/detailStudent', {
                    title: `Chi tiết sinh viên: ${user.username}`,
                    student
                });
            } else if (user.role === 'advisor') {
                const advisor = await advisors.findOne({ where: { userID: userId } })
                res.render('roles/admin/detailAdvisor', {
                    title: `Chi tiết giảng viên: ${user.username}`,
                    advisor
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    async updateAccount(req, res, next) {
        const userId = req.params.id;
        const updatedData = req.body;

        try {
            // Kiểm tra nếu username đã thay đổi
            if (updatedData.username) {
                // Kiểm tra xem username đã tồn tại chưa (ngoại trừ người dùng hiện tại)
                const existingUser = await users.findOne({
                    where: {
                        username: updatedData.username,
                        id: { [Op.ne]: userId }, // Kiểm tra ngoại trừ user hiện tại
                    }
                });

                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
                }
            }

            // Nếu không có lỗi về username, tiến hành cập nhật thông tin người dùng
            await users.update(updatedData, { where: { id: userId } });
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    }

    async addAccount(req, res, next) {
        const { username, password, role } = req.body;
        try {
            if (!username || !password || !role) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin cần thiết!' });
            }
            const existingUser = await users.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Tên tài khoản đã tồn tại!' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await users.create({
                username: username,
                password: hashedPassword,
                role: role,
                active: true,
            });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
        }
    }
    async deleteAccount(req, res, next) {
        const { id } = req.params;
        try {
            const user = await users.findByPk(id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại!' });
            }
            await user.destroy();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi!' });
        }
    }

    async TopicList(req, res, next) {
        try {
            const list = await projects.findAll({
                include: [
                    {
                        model: projectadvisors,
                        as: 'projectadvisors',
                        attributes: ['project_id'],
                        include: [
                            {
                                model: advisors,
                                as: 'advisor',
                                attributes: ['advisorID', 'lastname', 'firstname']
                            }
                        ]
                    },
                    {
                        model: projectstudents,
                        as: 'projectstudents',
                        attributes: ['project_id'],
                        include: [
                            {
                                model: students,
                                as: 'student',
                                attributes: ['studentID', 'lastname', 'firstname']
                            }
                        ]
                    },
                ]
            });
            // // Chuyển đổi từng đối tượng trong mảng sang JSON
            // const list_data = list.map(item => item.toJSON());
            // console.log(JSON.stringify(list_data, null, 2));
            res.render('roles/admin/TopicList', {
                title: 'Dashboard admin',
                list: list,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                admin: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }



    RegisterTopicList(req, res, next) {
        res.render('roles/admin/RegisterTopicList', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            registertopiclistactive: true,
        });
    }

    EditAccount(req, res, next) {
        res.render('roles/admin/EditAccount', {
            title: 'Dashboard admin',
            showHeaderFooter: true,
            showNav: true,
            admin: true,
            editaccountactive: true,
        });
    }

    //[POST] /admin/create-toppic
    async createToppic(req, res, next) {
        const data = req.body;
        console.log('Data received:', data);

        const studentlist = Array.isArray(data.students) ? data.students : [];
        console.log(studentlist);
        const dateProject = new Date();

        const transaction = await sequelize.transaction();
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!data.title || !data.description || !data.status || !data.majorId) {
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
                                    id: studentId,  // So khớp với student_id
                                },
                                attributes: ['studentID', 'lastname', 'firstname'], // Lấy những trường cần thiết
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
            }

            // Thêm giảng viên hướng dẫn nếu có
            if (data.advisorId) {
                await projectadvisors.create({
                    project_id: project.id,
                    advisor_id: data.advisorId
                }, { transaction });
            }

            await transaction.commit();
            res.status(200).send({ message: 'Tạo đề tài thành công, vui lòng kiểm tra lại tại trang danh sách' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating project or students:', error);
            res.status(400).send({ message: error.message || 'Lỗi khi tạo dự án' });
        }
    }

    
    async updateTopic(req, res, next) {
        const { id } = req.params;
        const { title, description, start_date, end_date, status, advisor, students: studentList } = req.body;
        try {
            await projects.update(
                { title, description, start_date, end_date, status },
                { where: { id } }
            )
            // Cập nhật giảng viên hướng dẫn
            const [advisorID] = advisor.split(' - ');
            const advisorRecord = await advisors.findOne({ where: { advisorID } });
            console.log(advisorRecord);
            // if(advisorRecord){
            //     await projectadvisors.update(
            //         { advisor_id: advisorRecord.id },
            //         { where: { project_id: id } }
            //     );
            // }
            // Cập nhật danh sách sinh viên
            await projectstudents.destroy({ where: { project_id: id } });
            const newStudents = studentList.map((studentData) => {
                const [studentID] = studentData.split(' - ');
                return {
                  project_id: id,
                  student_id: studentID,
                };
            });
            console.log(newStudents);
        } catch (error) {

        }
    }
}
module.exports = new AdminController();