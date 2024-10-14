const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

//[GET]
router.get('/dashboard', controllers.admin.dashboard);

//[POST]
// router.post('/login', controllers.site.chklogin);


module.exports = router;    
