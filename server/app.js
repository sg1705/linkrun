'use strict';

var errorHandler;
var config = require('config');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
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
var GA = require('./model/google-analytics-tracking.js')

/**
 * Setup Express
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
const signInPage = config.get('static.signInPage')
app.use('/_/', express.static(path.join(__dirname, '../static/' + signInPage)));
app.use('/_/', express.static(path.join(__dirname, '../static/')));

app.use('/opensearch.xml', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../static/opensearch.xml'));
});

/**
 * Go to the url requested
 */
app.get("/", auth.isLoggedIn, function (req, res, next) {
  res.redirect(APP_HOME);
});



app.use('/__/login/google', require('./googleauth.js'));
app.use('/__', auth.isLoggedIn, require('./routes/app-route.js'));
app.use('/__/api', auth.isLoggedIn, require('./routes/api-route.js'));



app.get("/:gourl", helper.setRouteUrl, auth.isLoggedIn, function (req, res, next) {
  let routeGoUrl = req.params.gourl;
  if (routeGoUrl == null) {
    //error condition
    logger.error('link is null');
    next();
  }
  // retrieve actual url
  let linkService = new LinkService();
  let ga = new GA();
  let orgId = cookie.getOrgIdFromCookie(req)
  let userId = cookie.getUserIdFromCookie(req)
  
  linkService.getLinkByGoLink(routeGoUrl, orgId)
    .then(linkEntities => { 
      
      if (linkEntities.entities.length == 0) {
        // gourl not found. attempt to find a close one.
        logger.info("no_url_found", "attempt to auto-correct");
        var sc = SC.spellChecker();
        linkService.getGourls(orgId)
          .then(shortNames => {
            let gourls = shortNames;
            sc.setDict(gourls);
            let correctedRouteGoUrl = sc.correct(routeGoUrl);
            logger.info('corrected_route_to', {'link' :correctedRouteGoUrl})
            return correctedRouteGoUrl;
          }).then((correctedRouteGoUrl) => {
            if (correctedRouteGoUrl) {
              linkService
              .getLinkByGoLink(correctedRouteGoUrl, orgId)
              .then(linkEntities => {
                let url = linkEntities.entities[0].url;
                if (!(url.startsWith('https://') || url.startsWith('http://'))) {
                  url = 'http://' + url;
                }
                res.redirect(301, url);
                ga.trackEvent(userId, orgId, 'Link', 'redirect', linkEntities.entities[0].id, '100')
              });
            } else {
              ga.trackEvent(userId, orgId, 'Link', 'redirect', 'no_url_found', '100')
              logger.info("no_route_found", {'link' : correctedRouteGoUrl});
              res.redirect(APP_HOME + '/link/create?link=' + routeGoUrl);
            }
          })
      } else if (!linkEntities.entities[0].url) {
        ga.trackEvent(userId, orgId, 'Link', 'redirect', 'empty_url', '100')
        logger.info("empty_url", "redirecting to links page");
        res.redirect(APP_HOME + '/link/create?link=' + routeGoUrl);
      } else { 
        let url = linkEntities.entities[0].url;
        if (!(url.startsWith('https://') || url.startsWith('http://'))) {
          url = 'http://' + url;
        }        
        ga.trackEvent(userId, orgId, 'Link', 'redirect', linkEntities.entities[0].id, '100')
        res.redirect(301, url);
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

module.exports = app;