'use strict';

var errorHandler;
var config = require('config');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var UserService = require('./model/user.js');
var OrgService = require('./model/org.js');
var LinkService = require('./model/link.js');
var cookie = require('./cookie.js');
var auth = require('./auth.js');
var helper = require('./helper.js');
var logger = require('./model/logger.js');
var SC = require('./model/spell-checker.js');
const got = require('got');

/**
 * Setup Express
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'my_precious'
}));
app.use(cookieParser('my-precious'));
const COOKIE_NAME = 'xsession';
/**
 * Setup Google Cloud monitoring
 */
if (process.env.NODE_ENV === 'production') {
  require('@google/cloud-trace').start();
  errorHandler = require('@google/cloud-errors').start();
  // app.use('/*.js',express.static(path.join(__dirname, '../dist')));
  // app.use('/*.css',express.static(path.join(__dirname, '../dist')));  
}

const APP_HOME = '/__/app';


/**
 * Setup Google Cloud monitoring
 */
if (process.env.NODE_ENV === 'staging') {
  require('@google/cloud-trace').start();
  errorHandler = require('@google/cloud-errors').start();
}

if (process.env.GCLOUD_PROJECT) {
  require('@google/cloud-debug').start();
}

const GA_TRACKING_ID = config.get('ga.GA_TRACKING_ID');

function trackEvent(client, category, action, label, value, cb) {
  const data = {
    // API Version.
    v: '1',
    // Tracking ID / Property ID.
    tid: GA_TRACKING_ID,
    // Anonymous Client Identifier. Ideally, this should be a UUID that
    // is associated with particular user, device, or browser instance.
    // cid: client,
    uid: client,
    
    // Event hit type.
    t: 'event',
    // Event category.
    ec: category,
    // Event action.
    ea: action,
    // Event label.
    el: label,
    // Event value.
    ev: value
  };

  return got.post('http://www.google-analytics.com/collect', {
    body: data
  });
}

/**
 * No cache
 */
app.get('/*', nocache);

//caching strategy is to not cache
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

/**
 * Static Home pageExpress Routes
 */
app.use('/_/', express.static(path.join(__dirname, '../static')));
app.use('/opensearch.xml', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../static/opensearch.xml'));
});

/**
 * Go to the url requested
 */
app.get("/", auth.isLoggedIn, function (req, res, next) {
  session.gourl = '/';
  res.redirect(APP_HOME);
});



app.use('/__/login/google', require('./googleauth.js'));
app.use('/__', auth.isLoggedIn, require('./routes/app-route.js'));
app.use('/__/api', auth.isLoggedIn, require('./routes/api-route.js'));



app.get("/:gourl", setRouteUrl, auth.isLoggedIn, function (req, res, next) {
  let routeGoUrl = session.gourl;
  if (routeGoUrl == null) {
    //error condition
    logger.error('link is null');
    next();
  }


  // retrieve actual url
  let linkService = new LinkService();
  let orgId = cookie.getOrgIdFromCookie(req)
  let userId = cookie.getUserIdFromCookie(req)

  linkService.getLinkByGoLink(routeGoUrl, orgId)
    .then(linkEntities => { 
      
      if (linkEntities.entities.length == 0) {
        // gourl not found. attempt to find a close one.
        logger.info("no_url_found, attempt to auto-correct");
        var sc = SC.spellChecker();
        linkService.getGourls(orgId)
          .then(shortNames => {
            let gourls = shortNames;
            sc.setDict(gourls);
            logger.info('gourls', gourls)
            let correctedRouteGoUrl = sc.correct(routeGoUrl);
            logger.info('corrected to ', correctedRouteGoUrl)
            return correctedRouteGoUrl;
          }).then((correctedRouteGoUrl) => {
            if (correctedRouteGoUrl) {
              linkService
              .getLinkByGoLink(correctedRouteGoUrl, orgId)
              .then(linkEntities => {
                res.redirect(301, linkEntities.entities[0].url);
                trackEvent(userId, 'Link', 'redirect', linkEntities.entities[0].id, '100')
              });
            } else {
              trackEvent(userId, 'Link', 'redirect', 'no_url_found', '100')
              logger.info("no_url_found, redirecting to links page");
              res.redirect(APP_HOME + '/link/create?link=' + routeGoUrl);
            }
          })
      } else if (!linkEntities.entities[0].url) {
        trackEvent(userId, 'Link', 'redirect', 'empty_url', '100')
        logger.info("empty_url, redirecting to links page");
        res.redirect(APP_HOME + '/link/create?link=' + routeGoUrl);
      } else { 
        trackEvent(userId, 'Link', 'redirect', linkEntities.entities[0].id, '100')
        res.redirect(301, linkEntities.entities[0].url);
      }
    })
    .catch(err => {
      logger.error(err);
      //error condition
      //route to error page
    })

});


// Basic error logger/handler
app.use(function (err, req, res, next) {
  res.status(500).send(err.message || 'Something broke!');
  next(err || new Error('Something broke!'));
});
if (process.env.NODE_ENV === 'production') {
  app.use(errorHandler.express);
}

if (module === require.main) {
  // Start the server
  var server = app.listen(config.get('server.port') || 8080, function () {
    var port = server.address().port;
    logger.debug('app_running_on_port ' + port);
  });
}

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

module.exports = app;