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

module.exports = router;  