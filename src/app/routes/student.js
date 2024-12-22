const express = require('express');
const router = express.Router();

const chkRoles = require('../../config/chkRoles');
const StudentController = require('../controllers/StudentController');

//[GET] /student/dashboard
router.get('/dashboard', chkRoles('student'), StudentController.dashboard);

//[GET] /student/registertopic
router.get('/registertopic', chkRoles('student'), StudentController.registertopic);

//[GET] /student/updateprocess
router.get('/updateprocess', chkRoles('student'), StudentController.updateprocess);

//[GET] /student/accountinfo
router.get('/accountinfo', chkRoles('student'), StudentController.accountinfo);

//[GET] /student/project
router.get('/project', chkRoles('student'), StudentController.project);



module.exports = router;    
