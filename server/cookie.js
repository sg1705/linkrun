'use strict';

var config = require('config');

const COOKIE_NAME = config.get('COOKIE_NAME');

/**
 * Sets the cookie in the header
 * 
 * @param http response
 * @param user id
 * @param org id
 */
function setCookie(res, userId, orgId) {
  res.cookie(
    COOKIE_NAME, 
    { userId: userId,
      orgId:  orgId},
    { signed: true });
}

function getOrgIdFromCookie(req) {
  var xsession = req.signedCookies[COOKIE_NAME];
  if (xsession == null)
    return null;
  return xsession.orgId;
}

function getXsession(req) {
    return req.signedCookies[COOKIE_NAME];
}


module.exports = {
    setCookie: setCookie,
    getOrgIdFromCookie: getOrgIdFromCookie,
    getXsession: getXsession
};