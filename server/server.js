'use strict';

var errorHandler;
var config        = require('config');
var path          = require('path');
var express       = require('express');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var passport      = require('passport');
var google        = require('googleapis');
var youtube       = google.youtube('v3');

var GoogleStrategy  = require('passport-google-oauth20').Strategy;
var Passport = require('./passport.js');



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



/**
 * Setup Express
 */
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
new Passport().setupPassport();



/**
 * Express Routes
 */
app.use(express.static(path.join(__dirname, '../dist')));


app.get("/", isLoggedIn, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/main.html'));
});

app.get("/login", function(req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/main.html'));
});


app.get('/login/google',
  passport.authenticate('google', 
  { scope: ['email'], 
    accessType: 'offline',
    }
));

app.get(config.get('oauthCallbacks.googleCallbackUri'), 
    passport.authenticate('google', { 
      successRedirect: '/',
      failureRedirect: '/login'}),
    function(req, res) {
        console.log('authenticated');
        res.redirect('/');
})

/**
 * Check if user is authenticated
 */
app.use("/:gourl",function(req,res, next) {
    console.log(req.params.gourl);
    session.gourl = req.params.gourl;

    isLoggedIn(req,res, () => {
      res.redirect(301, 'http://www.cnn.com');
    });
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
  var server = app.listen(process.env.port || 8090, function () {
    var port = server.address().port;
    console.log('App listening on port %s', port);
    console.log('Press Ctrl+C to quit.');
  });
}

/**
 * Check if user is logged in
 */
function isLoggedIn(req, res, next) {
   console.log('checking if logged in');
    if (req.isAuthenticated()) {
        console.log('user is authenticated');
        return next();
    }
    res.redirect('/login');
}


// module.exports = app;