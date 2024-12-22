const express = require('express');
const router = express.Router();

const chkRoles = require('../../config/chkRoles');

const AdminController = require('../controllers/AdminController');
//[GET] /admin
router.get('/dashboard', chkRoles('admin'), AdminController.dashboard);
//[GET] /admin/TopicList
router.get('/TopicList', chkRoles('admin'), AdminController.TopicList);
//[GET] /admin/AccountManagement
router.get('/AccountManagement', chkRoles('admin'), AdminController.AccountManagement);
//[GET] /admin/AdvisorList
router.get('/AdvisorList', chkRoles('admin'), AdminController.AdvisorList);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
