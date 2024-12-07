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

//[POST]



module.exports = router;    
