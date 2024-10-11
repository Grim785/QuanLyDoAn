const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

router.get('/login', controllers.site.login); // /login
// router.get('/getu', controllers.site.getUser);


router.get('/test', controllers.site.test);
router.post('/testlogin', controllers.site.testlogin);


router.get('/', controllers.site.index); // /home

module.exports = router;