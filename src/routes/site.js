const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

//[GET] /
router.get('/', controllers.site.index);

//[POST]
router.post('/login', controllers.site.chklogin);





module.exports = router;