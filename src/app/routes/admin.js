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
//[GET] /admin/RegisterTopicList
router.get('/RegisterTopicList', chkRoles('admin'), AdminController.RegisterTopicList);
//[GET] /admin/EditAccount
router.get('/EditAccount', chkRoles('admin'), AdminController.EditAccount);
//[GET] /admin/EditAccount
router.get('/create-toppic', chkRoles('admin'), AdminController.loadcreateToppic);
//[GET] /admin/search
router.get('/search', chkRoles('admin'), AdminController.searchStudents);
//[POST] /admin/create-toppic
router.post('/create-toppic', chkRoles('admin'), AdminController.createToppic);


module.exports = router;    
