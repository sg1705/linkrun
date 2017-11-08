'use strict';

const express = require('express');
const config = require('config');
var path = require('path');

const router = express.Router();

// api
router.use('/users', require('../api/user.api'));
router.use('/linksv2', require('../api/link.api'));

module.exports = router;
