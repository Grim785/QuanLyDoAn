const express = require('express');
const router = express.Router();

const chkRoles = require('../../config/chkRoles');
const StudentController = require('../controllers/StudentController');

//[GET] /student
    //---Giao diện trang chủ sinh viên
    router.get('/dashboard', chkRoles('student'), StudentController.dashboard);
    //---Giao diện đăng ký đề tài
    router.get('/register-topic', chkRoles('student'), StudentController.registerTopic);
//[POST] /student
    //---Chức năng đăng ký đề tài
    router.post('/register-topic', chkRoles('student'), StudentController.createTopic);
//[DELETE] /student
    //---Chức năng xóa thông tin đề tài không được duyệt
    router.delete('/delete-topic/:id', chkRoles('student'), StudentController.deleteTopic);


//[GET] /student/updateprocess
router.get('/updateprocess', chkRoles('student'), StudentController.updateprocess);

module.exports = router;    
