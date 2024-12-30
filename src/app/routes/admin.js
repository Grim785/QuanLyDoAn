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
    router.get('/search', chkRoles('admin'), AdminController.studentSearch);
//[POST] /admin
//[PUT] /admin
//[DELETE] /admin






//[GET] /admin/EditAccount
router.get('/create-toppic', chkRoles('admin'), AdminController.loadcreateToppic);



//[POST] /admin/addRecord
router.post('/addRecordStudent', chkRoles('admin'), AdminController.addStudent);
//[DELETE] /admin/deleteAccount/:id
router.delete('/deleteRecordStudent/:id', chkRoles('admin'), AdminController.deleteStudent);
//[PUT] /admin/updateAccount/:id
router.put('/updateRecordStudent/:id', chkRoles('admin'), AdminController.updateStudent);
//[POST] /admin/addRecord
router.post('/addRecord', chkRoles('admin'), AdminController.addAdvisor);
//[DELETE] /admin/deleteAccount/:id
router.delete('/deleteRecord/:id', chkRoles('admin'), AdminController.deleteAdvisor);
//[PUT] /admin/updateAccount/:id
router.put('/updateRecord/:id', chkRoles('admin'), AdminController.updateAdvisor);
//[POST] /admin/create-toppic
router.post('/create-toppic', chkRoles('admin'), AdminController.createToppic);
//[POST] /admin/updateAccount/:id
router.post('/updateAccount/:id', chkRoles('admin'), AdminController.updateAccount);
//[POST] /admin/addAccount
router.post('/addAccount', chkRoles('admin'), AdminController.addAccount);
//[POST] /admin/updateToppic/:id
router.put('/updateToppic/:id', chkRoles('admin'), AdminController.updateTopic);
//[DELETE] /admin/deleteAccount/:id
router.delete('/deleteProject/:id', chkRoles('admin'), AdminController.deleteProject);

module.exports = router;    
