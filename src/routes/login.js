const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

router.get('/', controllers.login.index); // home




module.exports = router;