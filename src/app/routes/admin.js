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
//[GET] /admin/details/student/:id
router.get('/details/student/:id', chkRoles('admin'), AdminController.userDetail);
//[GET] /admin/details/advisor/:id
router.get('/details/advisor/:id', chkRoles('admin'), AdminController.userDetail);
//[POST] /admin/create-toppic
router.post('/createToppic', chkRoles('admin'), AdminController.createToppic);
//[POST] /admin/updateAccount/:id
router.post('/updateAccount/:id', chkRoles('admin'), AdminController.updateAccount);
//[POST] /admin/addAccount
router.post('/addAccount', chkRoles('admin'), AdminController.addAccount);
//[DELETE] /admin/deleteAccount/:id
router.delete('/deleteAccount/:id', chkRoles('admin'), AdminController.deleteAccount);

module.exports = router;    
