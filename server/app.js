'use strict';

var errorHandler;
var config       = require('config');
var path         = require('path');
var express      = require('express');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path         = require('path');
var cookieParser = require('cookie-parser');
var UserService  = require('./model/user.js');
var OrgService   = require('./model/org.js');
var LinkService  = require('./model/link.js');
var cookie       = require('./cookie.js');
var auth         = require('./auth.js');
var googAuth     = require('./googleauth.js');
var Logger       = require('./model/log.js');
/**
 * Setup Google Cloud monitoring
 */
if (process.env.NODE_ENV === 'production') {
  require('@google/cloud-trace').start();
  errorHandler = require('@google/cloud-errors').start();
  app.use('/*.js',express.static(path.join(__dirname, '../dist')));
  app.use('/*.css',express.static(path.join(__dirname, '../dist')));  
}

if (process.env.GCLOUD_PROJECT) {
  require('@google/cloud-debug').start();
}
let logger = new Logger();

/**
 * Setup Express
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
  resave: true,
  saveUninitialized: true,
  secret: 'my_precious' }));
app.use(cookieParser('my-precious'));



const COOKIE_NAME = 'xsession';

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
 * Express Routes
 */


/**
 * Go to the url requested
 */
app.get("/", auth.isLoggedIn, function (req, res, next) {
  session.gourl = '/';
  console.log("routing_url =",getRouteUrl());
  // res.sendFile(path.join(__dirname, '../dist/main.html'));
  res.redirect('/links');
});

// links
app.get("/login", function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/login/google', function (req, res, next) {
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
      return orgService.getOrgByName(userInfo.hd);
    })
    //retrieve org
    .then(orgEntities => {
      if (orgEntities.entities.length == 0) {
        //org doesn't exist
        console.log('org doesnt exist');
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
      console.log('routing_to_301=',getRouteUrl());
      res.redirect(301,getRouteUrl());
    })
    //error
    .catch(err => {
      console.log('routing_to_err=', err);
      //return err
    });
  });

// users
app.use('/api/users', require('./model/user.api'));

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/links', auth.isLoggedIn, require('./model/crud'));
app.use('/api/links', require('./model/link.api'));

app.get("/:gourl", setRouteUrl, auth.isLoggedIn, function (req, res, next) {
  let routeGoUrl = session.gourl;
  if (routeGoUrl == null) {
    //error condition
    next();
  }
  // retrieve actual url
  let linkService = new LinkService();
  linkService.getLinkByGoLink(routeGoUrl, cookie.getOrgIdFromCookie(req))
  .then(linkEntities => {
    if (linkEntities.entities.length > 0) {
      //retrieve the first one
      let linkEntity = linkEntities.entities[0];
      logger.log(linkEntity.orgId, linkEntity.userId, linkEntity.gourl, "getLinkByGoLink", "retrieve actual url");
      if (linkEntity.url) {
        res.redirect(301, linkEntity.url);
      } else {
        console.log("url_is_empty, redirecting to links");
        res.redirect('/links');
      }
    } else {
      console.log("no_url_found, redirecting to links");
      res.redirect('/links');
    }
  })
  .catch(err => {
    console.log(err);
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
    console.log('App listening on port %s', port);
    console.log('Press Ctrl+C to quit.');
  });
}

function getRouteUrl() {
  var routeUrl = '/';
  if ((session.gourl == null) || (session.gourl == '/')) {
    routeUrl = '/';
  } else {
    routeUrl = '/' + session.gourl;
  }
  console.log('route to:', routeUrl);
  return routeUrl;
}

function setRouteUrl(req, res, next) {
  session.gourl = req.params.gourl;
  console.log('setting path:', session.gourl);
  next();
}


/**
 * Returns a user entity. If the user doesn't exist then it creates one
 * 
 * @param http response
 * @param orgEntity
 * @param userinfo returned by Google
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
        console.log(userData);
        if (userData.entities.length > 0) {
          console.log('user exist');
          //user exists
          //update user
          let userEntity = userData.entities[0];
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
          console.log('user doesnt exist');
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