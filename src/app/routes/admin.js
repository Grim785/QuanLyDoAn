const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

//[GET] /
router.get('/dashboard', controllers.admin.dashboard);
//[GET] /admin/TopicList
router.get('/TopicList', controllers.admin.TopicList);

router.get('/AccountManagement',controllers.admin.AccountManagement);

router.get('/AdvisorList', controllers.admin.AdvisorList);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
