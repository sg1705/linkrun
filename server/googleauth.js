'use strict';

var config       = require('config');
var google       = require('googleapis');
var oauth2       = google.oauth2('v2');
var OAuth2       = google.auth.OAuth2;
var logger       = require('./model/logger.js')
var auth         = require('./auth.js');
var GA = require('./model/google-analytics-tracking.js')
var cookie = require('./cookie.js');

const express    = require('express');
const router     = express.Router();


/**
 * Handles OAuth callback
 * 
 * @param http request
 * @return response from oauth2.userinfo
 */
function handleOAuth2Callback(req) {
  return new Promise((resolve, reject) => {
    var oauth2Client = new OAuth2(
      config.get('oauthCredentials.google.id'),
      config.get('oauthCredentials.google.secret'),
      config.get('oauthCallbacks.googleCallbackUrl')
    );    
    var code = req.query.code;
    if (code != null) {
      oauth2Client
        .getToken(code, function (err, tokens) {
          if (!err) {
            oauth2Client.setCredentials(tokens);
            oauth2.userinfo.get({
              auth: oauth2Client
            }, function (err, response) {
              if (err) {
                logger.error('Failed to login', {'error':error});
                reject(err)
              } else {
                //inject refresh token in userinfo
                response.refresh_token = tokens.refresh_token;
                resolve(response);
              }
            })
          }
        });
      }
  });
}

function getGoogleAuthUrl() {
    var oauth2Client = new OAuth2(
    config.get('oauthCredentials.google.id'),
    config.get('oauthCredentials.google.secret'),
    config.get('oauthCallbacks.googleCallbackUrl')
    );
    return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    });
}


/**
 * /__/login/google
 */
router.get('/', function (req, res, next) {
  res.redirect(getGoogleAuthUrl() + '&approval_prompt=force')
});

/**
 * /__/login/google/oauthcallback
 */
router.get('/oauthcallback',
  function (req, res, next) {
    let userInfo = null;
    handleOAuth2Callback(req)
      //retrieve userinfo from google
      .then((userinfo) => {
        userInfo = userinfo;
        logger.info('userinfo from google', userInfo);
        if (userInfo.hd == null) {
          userInfo.hd = userInfo.email;
        }
        logger.info('user_login', { 'org': userInfo.hd });
        return auth.authenticateUser(
          res,
          req,
          'google', 
          userInfo.hd,
          userInfo.email, 
          userInfo.given_name, 
          userInfo.family_name, 
          userInfo.picture, 
          userInfo.refresh_token);
      })
      .catch(err => {
        logger.error('routing error', err);
      });
  });

module.exports = router;