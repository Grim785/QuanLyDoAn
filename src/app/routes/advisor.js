const express = require('express');
const router = express.Router();

const AdvisorController = require('../controllers/AdvisorController');
const chkRoles = require('../../config/chkRoles');
//[GET] /advisor/dashboard
router.get('/dashboard', chkRoles('advisor'), AdvisorController.dashboard);

//[GET] /advisor/topic
router.get('/topic', chkRoles('advisor'), AdvisorController.topic);

//[POST] /advisor/approve-topic/:id
router.post('/approve-topic/:id', chkRoles('advisor'), AdvisorController.approveToppic);
//[POST] /advisor/reject-topic/:id
router.post('/reject-topic/:id', chkRoles('advisor'), AdvisorController.rejectTopic);




module.exports = router;    
