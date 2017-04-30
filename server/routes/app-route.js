'use strict';

const express = require('express');
const config = require('config');
var path = require('path');
var session = require('express-session');

const router = express.Router();

// angular app

router.get('/app*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

router.use('/', express.static(path.join(__dirname, '../../dist')));

module.exports = router;
