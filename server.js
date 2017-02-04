'use strict';

var errorHandler;
var config          = require('config');
var path          = require('path');
var express       = require('express');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var passport      = require('passport');
var google        = require('googleapis');
var youtube       =  google.youtube('v3');

var GoogleStrategy  = require('passport-google-oauth2').Strategy;

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

app.use(express.static(path.join(__dirname, 'dist')));

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
passport.use(

  new GoogleStrategy({
    clientID         : config.get('oauthCredentials.google.id'),
    clientSecret     : config.get('oauthCredentials.google.secret'),
    callbackURL      : config.get('oauthCallbacks.googleCallbackUrl'),
    passReqToCallback: true
  },
    
  function(request, accessToken, refreshToken, profile, done) {
      console.log(JSON.stringify(profile));
  })

); // end passport.use()



app.get('/google',
  passport.authenticate('google', { scope: ['email'], accessType: 'offline'}
));


// app.use('*', function (req, res) {
//   return res.sendFile(path.join(__dirname, 'dist/index.html'));
// });




app.get(config.get('oauthCallbacks.googleCallbackUri'), 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
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

// module.exports = app;