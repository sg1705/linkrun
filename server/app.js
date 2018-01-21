'use strict';

var errorHandler;

/**
 * Setup Google Cloud monitoring
 */
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start();
  errorHandler = require('@google-cloud/error-reporting')();
}

/**
 * Setup Google Cloud monitoring
 */
if (process.env.NODE_ENV === 'staging') {
  require('@google-cloud/trace-agent').start();
  errorHandler = require('@google-cloud/error-reporting')();
}

if (process.env.GCLOUD_PROJECT) {
  require('@google-cloud/debug-agent').start();
}



var config = require('config');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var helmet = require('helmet')
var UserService = require('./model/user.js');
var OrgService = require('./model/org.js');
var LinkService = require('./model/link.js');
var cookie = require('./cookie.js');
var auth = require('./auth.js');
var helper = require('./helper.js');
var logger = require('./model/logger.js');
var SC = require('./model/spell-checker.js');
var GA = require('./model/google-analytics-tracking.js')
var fs = require('fs');

/**
 * Setup Express
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('my-precious'));

app.use(helmet());
if (process.env.NODE_ENV == 'production') {
  app.use(helmet.hsts({
    maxAge: 5184000,
    includeSubDomains: false,
    setIf: function (req, res) {
        if (req.secure) {
          return true
        } else {
          return false
        }
      }    
    }))
}

const COOKIE_NAME = 'xsession';

const APP_HOME = '/__/app';
const LINK_ACL_DEFAULT = 0;
const LINK_ACL_PUBLIC = 1;
const LINK_ACL_PRIVATE = 2;


//set proxy
if ((process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'staging')) {
  app.set('trust proxy', true);
}

//route to https if production
app.use(function(req, res, next){
  if (process.env.NODE_ENV === 'production') {
    if (!req.secure) {
      res.redirect('https://link.run' + req.url);
    } else {
      next();
    }
  } else {
    next();
  }
})

// apply no cache headers
app.get('/*', helper.noCache);


/**
 * Static Home pageExpress Routes
 */
// const signInPage = config.get('static.signInPage')
// app.use('/_/', express.static(path.join(__dirname, '../static/' + signInPage)));
app.use('/_/landing', function(req, res, next) {
  //check for auth
  if (auth.isLogged(req, res)) {
    res.sendFile(path.join(__dirname, '../static/landing.html'));
  } else {
    res.redirect('/');
  }
});
app.use('/_/termsofservice', express.static(path.join(__dirname, '../static/termsofservice.html')));
app.use('/_/privacypolicy', express.static(path.join(__dirname, '../static/privacypolicy.html')));
app.use('/_/', express.static(path.join(__dirname, '../static/index.html')));
app.use('/_/', express.static(path.join(__dirname, '../static/')));

app.use('/opensearch.xml', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../static/opensearch.xml'));
});

/**
 * serving public url 
 */
app.get("/@:orgShortName/:gourl", function(req, res, next) {
  let ga = new GA(); 
  logger.info('routeGoUrl:', req.params.gourl);
  logger.info('orgShortName:', req.params.orgShortName);
  let orgShortName = req.params.orgShortName;
  let routeGoUrl = req.params.gourl;
  let userId = "public_user"; 
  var orgId;

  if (orgShortName == null) {
    //error condition
    logger.error('orgShortName is null');
    next();
  }
  if (routeGoUrl == null) {
    //error condition
    logger.error('link is null');
    next();
  }
  let orgService = new OrgService();
  orgService.getOrgByShortName(orgShortName)
  //retrieve org
  .then(orgEntities => {
    if (orgEntities.entities.length == 0) {
          //org doesn't exist
          ga.trackEvent(userId, orgId, 'Link', 'redirect_failed', 'no_org_shortname_exist', '100');
          logger.info("no_org_shortname_exist", {'orgShortName' : orgShortName});
          // TODO: route to error page with warning that you are attepting to access 
          // org that does not exist. Violation will be reported.
          helper.serve404(req, "No workplace named \"" + orgShortName + "\" exits!", res);        // HTTP status 404: NotFound
          return;
    } else {
          // org exists
          orgId = orgEntities.entities[0].id;
          logger.info("orgShortName_exists", {'orgShortName' : orgShortName, 'orgId' : orgId});
          if (!orgEntities.entities[0].isPublicLinksAllowed) {
            logger.info("attempt_to_access_private_org_failed", {'link' : routeGoUrl, 'orgShortName' :orgShortName,  'orgId' : orgId});
            //TODO: route to error page with warning that you are attepting to access 
            // private link. Violation will be reported.  
            helper.serve404(req, "Workplace \""+ orgShortName + "\" is private. You don\'t have permission to access it", res);
            return;
          }
    }
    // retrieve actual url
    let linkService = new LinkService();
    linkService.getLinkByGoLink(routeGoUrl, orgId)
      .then(linkEntities => { 
        if ((linkEntities.entities.length == 0) || (!linkEntities.entities[0].url) )
        {
          ga.trackEvent(userId, orgId, 'Link', 'redirect_failed', 'no_url_found', '100');
          logger.info("no_url_found", {'userId':userId, 'orgId':orgId,'link' : routeGoUrl});
          helper.serve404(req, 'No URL found for the short link', res);
          return;
        } else {
          if (linkEntities.entities[0].acl != LINK_ACL_PUBLIC){
            logger.info("attempt_to_access_private_link_failed", {'link' : routeGoUrl,'orgShortName' :orgShortName, 'orgId' : orgId});
            //TODO: route to error page with warning that you are attepting to access 
            // private link. Violation will be reported.  
            helper.serve404(req, "It is private link. You don\'t have permission to access it", res);
            return;
          }
          helper.routeUrl(linkEntities, userId, orgId, ga, req, res);
        }
      })
    .catch(err => {
      logger.error(err);
      //error condition
      //route to error page
    })
  })
  .catch(err => {
    logger.error(err);
    //error condition
    //route to error page
  })
});

/**
 * Intercept any go url when user isn't logged in
 */
app.get("/:gourl", helper.setRouteUrl, function(req, res, next) {

  if (
        (req.params.gourl.indexOf('/__') > -1) 
        || (req.params.gourl.indexOf('/_/') > -1)
        || (req.params.gourl.indexOf('images/') > -1)) {
    next();
  }
  if (auth.isLogged(req, res)) {
    next();
  } else {
    fs.readFile(path.join(__dirname, '../static/refer.html'), 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
        next();
      }
      var result = data.replace(/mylink/g, req.params.gourl);
      res.set('Content-Type', 'text/html');
      res.send(result);
    });
  }
});
/**
 * Go to the url requested
 */
app.get("/", auth.isLoggedIn, function (req, res, next) {
  res.redirect(APP_HOME);
});

app.use('/__/logout', auth.logout);
app.use('/__/login/google', require('./googleauth.js'));
app.use('/__/login/msft', require('./msftauth.js'));
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
  let orgId = cookie.getOrgIdFromCookie(req);
  let userId = cookie.getUserIdFromCookie(req);
  
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
            logger.info('corrected_route_to', {'link' :correctedRouteGoUrl});
            return correctedRouteGoUrl;
          }).then((correctedRouteGoUrl) => {
            if (correctedRouteGoUrl) {
              linkService
              .getLinkByGoLink(correctedRouteGoUrl, orgId)
              .then(linkEntities => {
                let url = linkEntities.entities[0].url;
                if (!(url.startsWith('https://') || url.startsWith('http://') || url.startsWith('ftp://'))) {
                  url = 'http://' + url;
                }
                res.redirect(301, url);
                if (linkEntities.entities[0].userId == userId) 
                  ga.trackEvent(userId, orgId, 'Link', 'redirect', linkEntities.entities[0].id, '100');
                else 
                  ga.trackEvent(userId, orgId, 'Link', 'redirect_others', linkEntities.entities[0].id, '100');  
                logger.info("routing_link", {'userId':userId, 'orgId':orgId,'link' : linkEntities.entities[0]});
              });
            } else {
              ga.trackEvent(userId, orgId, 'Link', 'redirect_failed', 'no_url_found', '100');
              logger.info("no_route_found", {'userId':userId, 'orgId':orgId,'link' : correctedRouteGoUrl});
              res.redirect(APP_HOME + '/link/create?link=' + routeGoUrl);
            }
          })
      } else if (!linkEntities.entities[0].url) {
        ga.trackEvent(userId, orgId, 'Link', 'redirect_failed', 'empty_url', '100');
        logger.info("empty_url", "redirecting to links page");
        res.redirect(APP_HOME + '/link/create?link=' + routeGoUrl);
      } else { 
        helper.routeUrl(linkEntities, userId, orgId, ga, req, res);
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