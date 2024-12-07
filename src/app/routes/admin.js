const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

//[GET] /
router.get('/dashboard', controllers.admin.dashboard);
//[GET] /admin/TopicList
router.get('/TopicList', controllers.admin.topicList);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
