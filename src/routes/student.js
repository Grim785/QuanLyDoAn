const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

//[GET] /student/dashboard
router.get('/dashboard', controllers.student.dashboard);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
