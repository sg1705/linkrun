'use strict';

var logger = require('./model/logger.js');
var fs = require('fs');
var path = require('path');

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

function routeUrl(linkEntities, userId, orgId, ga, res) {
  let url = linkEntities.entities[0].url;
  if (!(url.startsWith('https://') || url.startsWith('http://') || url.startsWith('ftp://'))) {
    url = 'http://' + url;
  }        
  if (linkEntities.entities[0].userId == userId) 
    ga.trackEvent(userId, orgId, 'Link', 'redirect', linkEntities.entities[0].id, '100')
  else 
    ga.trackEvent(userId, orgId, 'Link', 'redirect others', linkEntities.entities[0].id, '100')      
  logger.info("routing_link", {'link' : linkEntities.entities[0]});
  res.redirect(301, url);
}

function serve404(req, msg, res) {
  fs.readFile(path.join(__dirname, '../static/404.html'), 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
    next();
  }
  var result = data.replace("mylink", req.params.gourl);
  var result = result.replace("Your colleague shared a short link", msg);
  res.set('Content-Type', 'text/html');
  res.status(404).send(result)
  });
}
module.exports = {
    setRouteUrl: setRouteUrl,
    getRouteUrl: getRouteUrl,
    clearRouteUrl: clearRouteUrl,
    routeUrl: routeUrl,
    serve404: serve404,
    noCache: noCache
};