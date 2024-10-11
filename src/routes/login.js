const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

router.get('/', controllers.site.login); // /login




module.exports = router;