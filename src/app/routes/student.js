const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const chkRoles = require('../../config/chkRoles');

//[GET] /student/dashboard
router.get('/dashboard', chkRoles('student'), controllers.student.dashboard);

//[GET] /student/registertopic
router.get('/registertopic', chkRoles('student'), controllers.student.registertopic);

//[GET] /student/updateprocess
router.get('/updateprocess', chkRoles('student'), controllers.student.updateprocess);

//[GET] /student/accountinfo
router.get('/accountinfo', chkRoles('student'), controllers.student.accountinfo);

//[GET] /student/project
router.get('/project', chkRoles('student'), controllers.student.project);

//[POST] /student/upload/project
router.post('/upload/project', controllers.file.uploadFile); // Route upload file dự án (chỉ cho phép file nén)

//[POST] /student/upload/project
router.post('/upload/avatar', controllers.file.uploadFile); // Route upload avatar (chỉ cho phép file hình ảnh)


module.exports = router;    
