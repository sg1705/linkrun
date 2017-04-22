'use strict';

var config       = require('config');
var google       = require('googleapis');
var oauth2       = google.oauth2('v2');
var OAuth2       = google.auth.OAuth2;
var Logger       = require('./model/logger.js')
let logger = new Logger();
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
    scope: ['https://www.googleapis.com/auth/userinfo.email']
    });
}




module.exports = {
    handleOAuth2Callback: handleOAuth2Callback,
    getGoogleAuthUrl: getGoogleAuthUrl
};