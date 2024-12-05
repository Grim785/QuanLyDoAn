const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

//[GET] /
router.get('/', controllers.login.login);

//[POST]
router.post('/chklogin', controllers.login.chklogin);



module.exports = router;