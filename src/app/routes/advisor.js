const express = require('express');
const router = express.Router();

const AdvisorController = require('../controllers/AdvisorController');
const chkRoles = require('../../config/chkRoles');
//[GET] /advisor/dashboard
router.get('/dashboard', chkRoles('advisor'), AdvisorController.dashboard);

//[GET] /advisor/topic
router.get('/topic', chkRoles('advisor'), AdvisorController.topic);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
