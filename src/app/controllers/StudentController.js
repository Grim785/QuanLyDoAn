const { where } = require("sequelize");
const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const { users, students, advisors, majors, class_, projects, projectstudents, projectadvisors } = models;

class StudentController {
    //[GET] /student/dashboard
    async dashboard(req, res, next) {
        try {
            const user_id = req.session.user.id;
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
                ],
                attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'status']
            });
            console.log(project);
            // project.forEach(proj => {
            //     if (proj.projectadvisors) {
            //         proj.projectadvisors.forEach(projectadvisor => {
            //             const advisor = projectadvisor.advisor;
            //             console.log('Giảng viên:', advisor.lastname, advisor.firstname);
            //         });
            //     }
            // });
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
                student: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }
    //[GET] /student/registertopic
    async registertopic(req, res, next) {
        // //Lấy danh sách tên đề tài có sẵn 
        // const suggestedProjects = await SuggestedProjects.findAll();
        // //Lấy danh sách tên chuyên ngành
        // const major = await Major.findAll();
        // //Lấy danh sách sinh viên
        // const students = await Student.findAll({ attributes: ['studentID']});
        // //Chuyển đổi thành dạng [...,...,...]
        // // const students = student.map(s => s.studentID); 
        // console.log(students);
        res.render('roles/student/RegisterTopic', {
            title: 'Đăng ký đề tài',
            // suggestedProjects: suggestedProjects,
            // major: major,
            studentID: students,
            showHeaderFooter: true,
            showNav: true,
            student: true,
            registertopicactive: true,
        });
    }

    // //[GET] /student/updateprocess
    updateprocess(req, res, next) {
        res.render('roles/student/UpdateProcess', {
            title: 'Cập nhật tiến độ',
            showHeaderFooter: true,
            showNav: true,
            student: true,
            updateprocessactive: true,
        });
    }

    // //[GET] /student/AccountInfo
    async accountinfo(req, res, next) {
        try {
            const user_id = req.session.user.id;
            const student = await students.findOne({
                where: { usersID: user_id },
                include: [
                    { model: users, as: 'user', attributes: ['gmail', 'phone'] },
                    // {model: files, as: 'files', attributes: ['file_path']}
                ],
                attributes: ['studentID', 'lastname', 'firstname', 'date_of_birth', 'gender', 'address'],
            });
            if (!student) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Student not found',
                });
            }
            const student_data = student.toJSON();
            res.render('roles/student/AccountInfo', {
                title: 'Thông tin tài khoản',
                data: student_data,
                dashboardactive: true,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                student: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
        }
    }
    //[GET] /student/project
    project(req, res, next) {
        res.render('roles/student/testupload', {
            title: 'AccountInfo',
            showHeaderFooter: true,
            showNav: true,
            student: true,
        });
    }
    //[GET] /student/project
    async projectDetails(req, res, next) {
        const topicId = req.params.id;
        try {
            const projectDetails = await projects.findOne({
                where: { id: topicId },
                include: [
                    //Nối đến bảng chuyên ngành lấy thông tin chuyên ngành của đề tài
                    {
                        model: majors,
                        as: 'major',
                        attributes: ['name'],
                    },
                    //Lấy thông tin giảng viên tham gia
                    {
                        model: projectadvisors,
                        as: 'projectadvisors',
                        attributes: ['advisor_id'],
                        //Nối đến bảng giảng viên lấy thông tin
                        include: [
                            {
                                model: advisors,
                                as: 'advisor',
                                attributes: ['lastname', 'firstname']
                            }
                        ]
                    },
                    //Lấy thông tin sinh viên tham gia
                    {
                        model: projectstudents,
                        as: 'projectstudents',
                        attributes: ['student_id'],
                        include: [
                            {
                                model: students,
                                as: 'student',
                                attributes: ['studentID', 'lastname', 'firstname', 'classID'],
                                include: [
                                    {
                                        model: users,
                                        as: 'user',
                                        attributes: ['role']
                                    },
                                    {
                                        model: class_,
                                        as: 'class',
                                        attributes: ['classID']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                attributes: ['title', 'description', 'start_date', 'end_date', 'status'],
            });
            // In dữ liệu dễ đọc với JSON.stringify
            console.log(JSON.stringify(projectDetails, null, 2));
            res.render('roles/student/TopicDetails', {
                title: 'AccountInfo',
                projectDetails: projectDetails,
                //Truyền dữ liệu hiển thị thành phần------
                showHeaderFooter: true,
                showNav: true,
                student: true,
                //----------------------------------------
            });
        } catch (error) {
            console.log(error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'An error occurred while fetching the topic'
            });
        }

    }
    //[POST]

}
module.exports = new StudentController();