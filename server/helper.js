'use strict';

var logger = require('./model/logger.js');

function getRouteUrl(req) {
  var routeUrl = '/';
  if ((routeUrlFromCookie(req) == null) || (routeUrlFromCookie(req) == '/')) {
    routeUrl = '/';
  } else {
    routeUrl = '/' + routeUrlFromCookie(req);
  }
  return routeUrl;
}

function setRouteUrl(req, res, next) {
  //store in cookie
  res.cookie('X_ROUTE', 
    { route: req.params.gourl},
    { signed: true });
  next();
}

function routeUrlFromCookie(req) {
  var xRoute = req.signedCookies['X_ROUTE'];
  if (xRoute == null)
    return null;
  return xRoute.route;
}


function clearRouteUrl(res) {
  res.cookie('X_ROUTE', '', {expires: new Date(0)});
}

module.exports = {
    setRouteUrl: setRouteUrl,
    getRouteUrl: getRouteUrl,
    clearRouteUrl: clearRouteUrl
};