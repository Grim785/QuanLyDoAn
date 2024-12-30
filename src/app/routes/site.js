const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/SiteController');
const { uploadProject, uploadAvatar} = require('../../config/file');

//[GET] /
    //---Giao diện đăng nhập ---
    router.get('/',SiteController.login);
    //---Giao diện lỗi chưa đăng nhập--- 
    router.get('/errlogin', SiteController.errlogin);
    //---Giao diện lỗi quyền truy cập
    router.get('/err403', SiteController.err403);
    //---Chức năng đăng xuất
    router.get('/logout', SiteController.logout);
    //---Chức năng tìm kiếm sinh viên
    router.get('/student-search', SiteController.searchStudents);
//[POST] /
    //---Kiểm tra đăng nhập
    router.post('/chklogin', SiteController.chklogin);
    //---Tải file
    router.post('/upload/project', uploadProject.single('file'), SiteController.uploadFile);
    
module.exports = router;