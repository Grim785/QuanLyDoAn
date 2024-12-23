const Student = require('../models/Student'); // Import model Student
const Major = require('../models/Major');     // Import model Major
const Class = require('../models/Class');     // Import model Class
const User = require("../models/User");
const File = require('../models/File');
const SuggestedProjects = require('../models/SuggestedProjects');

class StudentController{
    //[GET] /student/dashboard
    dashboard(req, res, next){
        const userId = req.session.user.id;
        Student.findOne({
            where: { usersID: userId }, // Tìm sinh viên dựa trên userID
            include: [
                { model: Major, as: 'major', attributes: ['name'] }, // Tham chiếu bảng Major
                { model: Class, as: 'class', attributes: ['classID'] }, // Tham chiếu bảng Class
                { model: File, as: 'file', attributes: ['file_path'] }, // Tham chiếu bảng File
            ],
            attributes: ['studentID', 'lastname', 'firstname', 'date_of_birth', 'gender'],
        })
        .then(student => {
            if (!student) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Student not found',
                });
            }
            const studentData = student.toJSON();
            // Định dạng ngày sinh
            const dob = new Date(studentData.date_of_birth);
            studentData.date_of_birth = `${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getFullYear()}`;
            console.log(studentData);
            res.render('roles/student/dashboard', {
                title: 'Trang chủ',
                user: req.session.user,
                showHeaderFooter: true,
                showNav: true,
                student: true,
                data: studentData,
                dashboardactive:true, // Chuyển đổi dữ liệu để sử dụng trong view
            });
        })
        .catch(next);
    }
    //[GET] /student/registertopic
    async registertopic(req, res, next){
        //Lấy danh sách tên đề tài có sẵn 
        const suggestedProjects = await SuggestedProjects.findAll();
        //Lấy danh sách tên chuyên ngành
        const major = await Major.findAll();
        //Lấy danh sách sinh viên
        const students = await Student.findAll({ attributes: ['studentID']});
        //Chuyển đổi thành dạng [...,...,...]
        // const students = student.map(s => s.studentID); 
        console.log(students);
        res.render('roles/student/RegisterTopic', {
            title: 'Đăng ký đề tài',
            suggestedProjects: suggestedProjects,
            major: major,
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
    accountinfo(req, res, next){
        const userId = req.session.user.id;
        Student.findOne({
            where: { usersID: userId }, // Tìm sinh viên dựa trên userID
            include: [
                { model: User, as: 'user', attributes: ['gmail', 'phone'] }, // Tham chiếu bảng Major
                { model: File, as: 'file', attributes: ['file_path'] } // Tham chiếu bảng File
                // { model: Class, as: 'class', attributes: ['classID'] }, // Tham chiếu bảng Class
            ],
            attributes: ['studentID', 'lastname', 'firstname', 'date_of_birth', 'gender', 'address'],
        })
        .then(student => {
            if (!student) {
                return res.status(404).render('error', {
                    title: 'Error',
                    message: 'Student not found',
                });
            }
            const studentData = student.toJSON();
            // Định dạng ngày sinh
            const dob = new Date(studentData.date_of_birth);
            studentData.date_of_birth = `${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getFullYear()}`;
            console.log(studentData);
            console.log(req.session.user)
            res.render('roles/student/AccountInfo', {
                title: 'Thông tin tài khoản',
                // user: req.session.user,
                showHeaderFooter: true,
                showNav: true,  
                student: true,
                data: studentData,
                dashboardactive:true, // Chuyển đổi dữ liệu để sử dụng trong view
            });
        })
        .catch(next);
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