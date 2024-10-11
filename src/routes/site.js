const express = require('express');
const router = express.Router();

const controllers = require('../app/controllers');

router.get('/', controllers.site.index);
router.get('/getu', controllers.site.getUser);

module.exports = router;