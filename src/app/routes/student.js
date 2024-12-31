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
    //---Chức năng xóa thông tin đăng ký đề tài không được duyệt
    router.delete('/delete-topic/:id', chkRoles('student'), StudentController.deleteTopic);


//[Delete] /deleteProgress/:progressId
router.delete('/deleteProgress/:progressid', chkRoles('student'), StudentController.deleteProgress);

//[POST] /addPogress
router.post('/addProgress',chkRoles('student'), StudentController.addProgress); 

//[PUT] /updatePogress/:progressId
router.put('/updateProgress/:Id',chkRoles('student'),StudentController.updateProgress); 

module.exports = router;    
