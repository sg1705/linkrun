'use strict';

var logger = require('./model/logger.js');



/**
 * Caching function
 */
//caching strategy is to not cache
function noCache(req, res, next) {
  if ((req.url.endsWith('bundle.js') || req.url.endsWith('bundle.css')) && (process.env.NODE_ENV)) {
    console.log('request url is:', req.url);
    res.header('Cache-Control','public, max-age=31536000');
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
  }
  next();
}


/**
 * Route functions
 */
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
  console.log('gourl:' + req.params.gourl);
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
    clearRouteUrl: clearRouteUrl,

    noCache: noCache
};