'use strict';

var cookie = require('./cookie.js');

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
    return true;
  }
  console.log('UserId is not set in Session');
  return false;
}

module.exports = {
    isLoggedIn: isLoggedIn
};