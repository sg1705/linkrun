'use strict';

var cookie = require('./cookie.js');


/**
 * Check if user is logged in
 */
function isLoggedIn(req, res, next) {
  if (isUserIdSetInCookie(req)) {
    console.log('user is authenticated');
    return next();
  }
  res.redirect('/login');
}

function isUserIdSetInCookie(req) {
  var xsession = cookie.getXsession(req);
  if (xsession == null)
    return false;
  var userId = xsession.userId;
  console.log('retrieved cookie', userId);  
  if (userId != null) {
    return true;
  }
  return false;
}

module.exports = {
    isLoggedIn: isLoggedIn
};