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

//[GET] /student/details/Toppic/:id
router.get('/details/Toppic/:id', chkRoles('student'), StudentController.projectDetails);
//[GET] /admin/search
router.get('/search', chkRoles('student'), StudentController.searchStudents);

//[POST] /student/create-toppic
router.post('/registerToppic', chkRoles('student'), StudentController.createToppic);

//[DELETE] /delete-topic/:projectId
router.delete('/delete-topic/:projectId', chkRoles('student'), StudentController.deleteToppic);

//[Delete] /deleteProgress/:progressId
router.delete('/deleteProgress/:progressid', chkRoles('student'), StudentController.deleteProgress);

//[POST] /addPogress
router.post('/addProgress',chkRoles('student'), StudentController.addProgress); //

//[PUT] /updatePogress/:progressId
router.put('/updateProgress/:Id',chkRoles('student'),StudentController.updateProgress); //

module.exports = router;    
