'use strict';

var cookie = require('./cookie.js');
var logger = require('./model/logger.js');

/**
 * Check if user is logged in
 */
function isLoggedIn(req, res, next) {
  if (isUserIdSetInCookie(req)) {
    return next();
  }
  res.redirect('/_/');
}

function isUserIdSetInCookie(req) {
  var xsession = cookie.getXsession(req);
  if (xsession == null)
    return false;
  var userId = xsession.userId;  
  if (userId != null) {
    logger.debug('userId_from_cookie', {'userId': userId})
    return true;
  }
  logger.info('UserId is not set in Session');
  return false;
}

module.exports = {
    isLoggedIn: isLoggedIn
};