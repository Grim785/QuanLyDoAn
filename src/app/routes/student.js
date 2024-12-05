const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

//[GET] /student/dashboard
router.get('/dashboard', controllers.student.dashboard);

// //[GET] /student/registertopic
router.get('/registertopic', controllers.student.registertopic);

// //[GET] /student/updateprocess
router.get('/updateprocess', controllers.student.updateprocess);

// //[GET] /student/accountinfo
router.get('/accountinfo', controllers.student.accountinfo);

//[POST]



module.exports = router;    
