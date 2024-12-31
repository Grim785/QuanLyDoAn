const express = require('express');
const router = express.Router();
exports.router = router;

const chkRoles = require('../../config/chkRoles');
const AdminController = require('../controllers/AdminController');
//[GET] /admin
    //---Giao diện quản lý sinh viên
    router.get('/student-management', chkRoles('admin'), AdminController.studentManagement);
    //---Giao diện quản lý giảng viên
    router.get('/advisor-management', chkRoles('admin'), AdminController.advisorManagement);
    //---Chức năng tìm kiếm sinh viên
    router.get('/students/search', chkRoles('admin'), AdminController.studentSearch);
    //---Chức năng tìm kiếm giảng viene
    router.get('/advisor/search', chkRoles('admin'), AdminController.advisorSearch);
//[POST] /admin
    //---Chức năng thêm sinh viên mới
    router.post('/students/add', chkRoles('admin'), AdminController.addStudent);
    //---Chức năng xóa sinh viên
    router.post('/students/delete', chkRoles('admin'), AdminController.deleteStudents);
    //--Chức năng sửa thông tin sinh viên
    router.post('/students/update', chkRoles('admin'), AdminController.updateStudents);
    //---Chức năng thêm giảng viên mới
    router.post('/adviors/add', chkRoles('admin'), AdminController.addAdvisor);
    //---Chức năng xóa giảng viên
    router.post('/adviors/delete', chkRoles('admin'), AdminController.deleteAdvisor);
    //--Chức năng sửa thông tin sinh viên
    router.post('/adviors/update', chkRoles('admin'), AdminController.updateAdvisor);
//[PUT] /admin
//[DELETE] /admin
module.exports = router;    
