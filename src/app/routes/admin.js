const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const chkRoles = require('../../config/chkRoles');
//[GET] /
router.get('/dashboard', chkRoles('admin'), controllers.admin.dashboard);
//[GET] /admin/TopicList
router.get('/TopicList', chkRoles('admin'), controllers.admin.TopicList);

router.get('/AccountManagement', chkRoles('admin'), controllers.admin.AccountManagement);

router.get('/AdvisorList', chkRoles('admin'), controllers.admin.AdvisorList);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
