const express = require('express');
const router = express.Router();

const ProjectController = require('../controllers/ProjectController');
const chkRoles = require('../../config/chkRoles');
//[GET] /project
    //---Giao diện danh sách đề tài
    router.get('/project-list', chkRoles(''), ProjectController.projectList)
    //---Giao diện chi tiết đề tài
    router.get('/:id/detail', chkRoles(''), ProjectController.projectDetails);
    //---Chức năng tìm kiếm đề tài
    router.get('/search', ProjectController.searchProjects);
//[POST] /project
    //---Chức năng thêm mới đề tài
    router.post('/add', chkRoles('admin'), ProjectController.addProject);
    //---Chức năng xóa đề tài
    router.post('/delete', chkRoles('admin'), ProjectController.deleteProject);
    //---Chức năng sửa đề tài
    router.post('/update', chkRoles('admin'), ProjectController.updateProject);
    //---Chức năng thêm mới báo cáo tiến độ
    router.post('/addProgress',chkRoles('student'), ProjectController.addProgress); 
//[PUT] /project
    //---Chức năng cập nhật tiến độ /updatePogress/:progressId
    router.put('/updateProgress/:Id',chkRoles('student'),ProjectController.updateProgress); 
//[DELETE] /project
    //---Chức năng xóa tiến độ
    router.delete('/deleteProgress/:progressid', chkRoles('student'), ProjectController.deleteProgress);
module.exports = router;  