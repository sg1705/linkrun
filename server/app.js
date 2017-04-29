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
var googAuth = require('./googleauth.js');
var logger = require('./model/logger.js');
var SC = require('./model/spell-checker.js');

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
app.use('/_/', express.static(path.join(__dirname, '../static')));


/**
 * Go to the url requested
 */
app.get("/", auth.isLoggedIn, function (req, res, next) {
  session.gourl = '/';
  // res.sendFile(path.join(__dirname, '../dist/main.html'));
  res.redirect('/__/links');
});

// links
app.get("/login", function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// links
app.get("/form", function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// links
app.get("/links", function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


app.get('/__/login/google', function (req, res, next) {
  res.redirect(googAuth.getGoogleAuthUrl() + '&approval_prompt=force')
});

app.use(express.static(path.join(__dirname, '../dist')));


app.get(
  config.get('oauthCallbacks.googleCallbackUri'),
  function (req, res, next) {
    let userInfo = null;
    let orgService = new OrgService();
    googAuth.handleOAuth2Callback(req)
      //retrieve userinfo from google
      .then((userinfo) => {
        userInfo = userinfo;
        if (userInfo.hd == null) {
          userInfo.hd = userInfo.email;
        }
        logger.info('user_login', { 'userInfo': userInfo.hd });
        return orgService.getOrgByName(userInfo.hd);
      })
      //retrieve org
      .then(orgEntities => {
        if (orgEntities.entities.length == 0) {
          //org doesn't exist
          logger.info('org doesnt exist for user', userInfo);
          return orgService.createOrg(userInfo.hd, 'google')
            .then((orgEntity) => {
              return getUser(res, orgEntity, userInfo, userInfo.refresh_token);
            });
        } else {
          // org exists
          let orgEntity = orgEntities.entities[0];
          return getUser(res, orgEntity, userInfo, userInfo.refresh_token);
        }
      })
      //retrieve user
      .then((data) => {
        logger.info('routing to 301' + getRouteUrl());
        res.redirect(301, getRouteUrl());
      })
      //error
      .catch(err => {
        logger.error('routing error', err);
        //return err
      });
  });

// users
app.use('/__/api/users', require('./model/user.api'));
app.use('/__/api/linksv2', require('./api/link.api'));

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/__/links', auth.isLoggedIn, require('./model/crud'));
app.use('/__/api/links', require('./model/link.api'));

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


  linkService.getLinkByGoLink(routeGoUrl, orgId)
    .then(linkEntities => { // gourl not found. attempt to find a close one.
      if (linkEntities.entities.length == 0) {
        logger.info("no_url_found, attempt to auto-correct");
        var sc = SC.spellChecker();
        linkService.getGourls(orgId)
          .then(shortNames => {
            let gourls = shortNames;
            sc.setDict(gourls);
            logger.info('gourls', gourls)
            routeGoUrl = sc.correct(routeGoUrl);
            logger.info('corrected to ', routeGoUrl)
          }).then(() => {
            if (routeGoUrl) {
              linkService.getLinkByGoLink(routeGoUrl, orgId)
                .then(linkEntities => res.redirect(301, linkEntities.entities[0].url));
            } else {
              logger.info("no_url_found, redirecting to links page");
              res.redirect('/__/links');
            }
          })
      } else if (!linkEntities.entities[0].url) {
        logger.info("empty_url, redirecting to links page");
        res.redirect('/__/links');
      } else { 
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


/**
 * Returns a user entity. If the user doesn't exist then it creates one
 * 
 * @param http response
 * @param orgEntity
 * @param response userinfo.email returned by Google
 * @param tokens returned by Google
 * @return user entity
 * 
 */
function getUser(res, orgEntity, response, refresh_token) {
  return new Promise((resolve, reject) => {
    let userService = new UserService();
    userService.readByColumn(
      'email',
      response.email)
      .then((userData) => {
        if (userData.entities.length > 0) {
          //user exists
          //update user
          let userEntity = userData.entities[0];
          logger.info('user exist', { 'userId': userEntity.userId });
          userService.updateUser(
            userEntity.id,
            userEntity.orgId,
            refresh_token,
            userEntity.email,
            userEntity.fName,
            userEntity.lName,
            userEntity.picture)
            .then((entity) => {
              //set cookie
              cookie.setCookie(res, entity.id, userEntity.orgId);
              resolve(true);
            });
        } else {
          //user doesn't exist create user
          logger.info('user doesnt exist');
          userService.createUser(
            orgEntity.id,
            refresh_token,
            response.email,
            response.given_name,
            response.family_name,
            response.picture)
            .then((entity) => {
              //set cookie
              cookie.setCookie(res, entity.id, entity.orgId);
              resolve(true);
            })
        }
      });
  })
}

module.exports = app;