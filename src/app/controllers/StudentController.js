const sequelize = require("../../config/db");
const initModels = require("../models/init-models");
// Khởi tạo tất cả các model và quan hệ
const models = initModels(sequelize);
// Truy cập model
const {users, students, files, majors, class_ } = models;

class StudentController{
    //[GET] /student/dashboard
    async dashboard(req, res, next){
        try {
            const user_id = req.session.user.id;
            const student = await students.findOne({
                where: {usersID: user_id},
                include: [
                    { model: majors, as: 'major', attributes: ['name']},
                    { model: class_, as: 'class', attributes: ['classID']},
                    // { model: files, as: 'files', attributes: ['file_path']},
                ],
                attributes: ['studentID', 'lastname', 'firstname', 'date_of_birth', 'gender'],
            });
            if (!student) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Student not found',
                });
            }
            const student_data = student.toJSON();
            // Định dạng ngày sinh ----------------------
            const dob = new Date(student_data.date_of_birth);
            student_data.date_of_birth = `${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getFullYear()}`;
            // -----------------------------------------
            res.render('roles/student/dashboard', {
                title: 'Trang chủ',
                data: student_data,
                dashboardactive:true,
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
    async registertopic(req, res, next){
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
    updateprocess(req, res, next){
        res.render('roles/student/UpdateProcess', {
            title: 'Cập nhật tiến độ',
            showHeaderFooter: true,
            showNav: true,
            student: true,
            updateprocessactive: true,
        });
    }

    // //[GET] /student/AccountInfo
    async accountinfo(req, res, next){
        try {
            const user_id = req.session.user.id;
            const student = await students.findOne({
                where: {usersID: user_id},
                include: [
                    {model: users, as: 'user', attributes: ['gmail', 'phone']},
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
            // Định dạng ngày sinh ----------------------
            const dob = new Date(student_data.date_of_birth);
            student_data.date_of_birth = `${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getFullYear()}`;
            // -----------------------------------------
            res.render('roles/student/AccountInfo', {
                title: 'Thông tin tài khoản',
                data: student_data,
                dashboardactive:true,
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
    project(req, res, next){
        res.render('roles/student/testupload', {
            title: 'AccountInfo',
            showHeaderFooter: true,
            showNav: true,
            student: true,
        });
    }
    //[POST]

}
module.exports = new StudentController();