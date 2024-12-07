const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const chkRoles = require('../../config/chkRoles');
//[GET]
router.get('/dashboard', chkRoles('advisor'), controllers.advisor.dashboard);

//[GET]
router.get('/topic', chkRoles('advisor'), controllers.advisor.topic);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
