const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

//[GET] /
router.get('/', controllers.login.login);
//[GET] /errlogin
router.get('/errlogin', controllers.login.errlogin);
//[GET] /
router.get('/err403', controllers.login.err403);
//[POST]
router.post('/chklogin', controllers.login.chklogin);



module.exports = router;