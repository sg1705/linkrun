'use strict';

var errorHandler;
var config = require('config');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var google = require('googleapis');
var youtube = google.youtube('v3');
var oauth2 = google.oauth2('v2');
var OAuth2 = google.auth.OAuth2;
var UserService = require('./model/user.js');
var OrgService = require('./model/org.js');


/**
 * Setup Google Cloud monitoring
 */
if (process.env.NODE_ENV === 'production') {
  require('@google/cloud-trace').start();
  errorHandler = require('@google/cloud-errors').start();
}

if (process.env.GCLOUD_PROJECT) {
  require('@google/cloud-debug').start();
}


var oauth2Client = new OAuth2(
  config.get('oauthCredentials.google.id'),
  config.get('oauthCredentials.google.secret'),
  config.get('oauthCallbacks.googleCallbackUrl')
);
var googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/userinfo.email']
});


console.log(oauth2.userinfo.get);

/**
 * Setup Express
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'my_precious' }));
app.use(cookieParser('my-precious'));

/**
 * Express Routes
 */
app.use(express.static(path.join(__dirname, '../dist')));

const COOKIE_NAME = 'xsession';


/**
 * Go to the url requested
 */
app.get("/", isLoggedIn, function (req, res, next) {
  session.gourl = '/';
  console.log(getRouteUrl());
  // res.sendFile(path.join(__dirname, '../dist/main.html'));
  res.redirect('/links');
});

// links
app.get("/login", function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/main.html'));
});

app.get('/login/google', function (req, res, next) {
  res.redirect(googleAuthUrl + '&approval_prompt=force')
});

app.get(
  config.get('oauthCallbacks.googleCallbackUri'),
  function (req, res, next) {
    var code = req.query.code;
    if (code != null) {
      oauth2Client.getToken(code, function (err, tokens) {
        console.log(tokens);
        if (!err) {
          oauth2Client.setCredentials(tokens);
          oauth2.userinfo.get({
            auth: oauth2Client
          }, function (err, response) {
            console.log('org is:', response.hd);
            if (response.hd == '')
              response.hd = response.email;

            let orgService = new OrgService();
            orgService
              .getOrgByName(response.hd)
              .then((data) => {
                console.log(data);
                if (data.entities.length == 0) {
                  //org doesn't exist
                  console.log('org doesnt exist');
                  orgService
                    .createOrg(response.hd, 'google')
                    .then((orgEntity) => {
                      getUser(res, orgEntity, response, tokens).then((data) => {
                      //route to next
                      res.redirect(301,getRouteUrl());
                    });        
                  });
                } else {
                  // org exists
                  let orgEntity = data.entities[0];
                  getUser(res, orgEntity, response, tokens)
                  .then((data) => {
                    //route to next
                    res.redirect(301,getRouteUrl());
                  });
                }
              });
            });
          }
      });
    }
  });


// users
app.use('/api/users', require('./model/user.api'));

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/links', isLoggedIn, require('./model/crud'));
app.use('/api/links', require('./model/link.api'));


app.get("/:gourl", setRouteUrl, isLoggedIn, function (req, res, next) {
  console.log(getRouteUrl());
  res.redirect(301, 'http://www.cnn.com');
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

/**
 * Check if user is logged in
 */
function isLoggedIn(req, res, next) {
  if (isUserIdSetInCookie(req)) {
    console.log('user is authenticated');
    return next();
  }
  res.redirect('/login');
}

function isUserIdSetInCookie(req) {
  var xsession = req.signedCookies[COOKIE_NAME];
  if (xsession == null)
    return false;
  var userId = xsession.userId;
  console.log('retrieved cookie', userId);  
  if (userId != null) {
    return true;
  }
  return false;
}

function getAccessToken(refresh_token) {

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

function setCookie(res, userId, orgId) {
  res.cookie(
    COOKIE_NAME, 
    { userId: userId,
      orgId:  orgId},
    { signed: true });
}

/**
 * Returns a user entity. If the user doesn't exist then it creates one
 * 
 * @param response
 * @param orgEntity
 * @param userinfo returned by Google
 * @param tokens returned by Google
 * 
 */
function getUser(res, orgEntity, response, tokens) {
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
              tokens.refresh_token,
              userEntity.email,
              userEntity.fName,
              userEntity.lName,
              userEntity.picture)
            .then((entity) => {
              //set cookie
              setCookie(res, entity.id, userEntity.orgId);
              resolve(true);
            });
        } else {
          //user doesn't exist create user
          console.log('user doesnt exist');
          userService.createUser(
            orgEntity.id,
            tokens.refresh_token,
            response.email,
            response.given_name,
            response.family_name,
            response.picture)
          .then((entity) => {
            //set cookie
            setCookie(res, entity.id, userEntity.orgId);
            resolve(true);
          })
        }
    });
  })
}

module.exports = app;