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

var app = express();


if (process.env.NODE_ENV === 'production') {
  require('@google/cloud-trace').start();
  errorHandler = require('@google/cloud-errors').start();
}

if (process.env.GCLOUD_PROJECT) {
  require('@google/cloud-debug').start();
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());




app.use(express.static(path.join(__dirname, '../dist')));


app.get("/", isLoggedIn, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/main.html'));
});





// app.get('/data.json', function (req, res, next) {
//   youtube.search.list({
//     part: 'snippet',
//     type: 'video',
//     q: 'google+cardboard+video+3d',
//     auth: process.env.API_KEY
//   }, function (err, result) {
//     if (err) {
//       return next(err);
//     }
//     res.json(result);
//   });
// });

// app.get('/search', function (req, res, next) {
//   youtube.search.list({
//     part: 'snippet',
//     type: 'video',
//     q: req.query.q
//   }, function (err, result) {
//     if (err) {
//       return next(new Error('Search error!'));
//     }
//     res.json(result);
//   });
// });

/**
 * PassportJS Google strategy specifics
 * Assumes you've inputted your OAuth service credentials in the
 * /config/default.json or production file as necessary.
 */

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log('serialize user');
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    console.log('deserializing');
    done(null, id);
});


passport.use(

  new GoogleStrategy({
    clientID         : config.get('oauthCredentials.google.id'),
    clientSecret     : config.get('oauthCredentials.google.secret'),
    callbackURL      : config.get('oauthCallbacks.googleCallbackUrl'),
    passReqToCallback: true,

  },
    
  function(request, accessToken, refreshToken, profile, done) {
      console.log(refreshToken);
      return done(null, profile);
  })

); // end passport.use()



app.get('/google',
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
    isLoggedIn(req,res, next);
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


function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
        console.log('checking if logged in');

    if (req.isAuthenticated()) {
        console.log('user is authenticated');
        return next();
    }

        

    // if they aren't redirect them to the home page
    res.redirect('/google');
}


// module.exports = app;