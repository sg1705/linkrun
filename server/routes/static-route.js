'use strict';

const express = require('express');
const config = require('config');
var path = require('path');
var session = require('express-session');

const router = express.Router();

// angular app

// router.get('/app*', function (req, res, next) {
//   const signInPage = config.get('pageLocation.signIn');
//   res.sendFile(path.join(__dirname, signInPage));
//   console.log('static routing')
// });

// router.use('/', express.static(path.join(__dirname, '../../static')));
router.use('/',  function(req, res, next) {
 res.sendFile(path.join(__dirname, '../../static/index-test.html'));
})
console.log('static route')
router.use('/*', express.static(path.join(__dirname, '../../static')));
module.exports = router;
