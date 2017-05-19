'use strict';

var session = require('express-session');

function getRouteUrl() {
  var routeUrl = '/';
  if ((session.gourl == null) || (session.gourl == '/')) {
    routeUrl = '/';
  } else {
    routeUrl = '/' + session.gourl;
  }
  return routeUrl;
}

function setRouteUrl(req, res, next) {
  session.gourl = req.params.gourl;
  logger.info('invoking link:' + session.gourl);
  next();
}

module.exports = {
    setRouteUrl: setRouteUrl,
    getRouteUrl: getRouteUrl
};