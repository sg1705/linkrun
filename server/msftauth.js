
/**
 * https://docs.microsoft.com/en-us/outlook/rest/node-tutorial
 */

var config       = require('config');
var logger       = require('./model/logger.js')
var auth         = require('./auth.js');
const express    = require('express');
const router     = express.Router();
var microsoftGraph = require("@microsoft/microsoft-graph-client");
var oauth2 = require('simple-oauth2').create(config.get('oauthCredentials.msft'));

// The scopes the app requires
var scopes = [ 'openid',
               'User.Read',
               'offline_access'];

var msftEmailDomains = ['hotmail.com',
                        'live.com', 
                        'msn.com', 
                        'passport.com',  
                        'outlook.com'];               
/**
 * Handles OAuth callback * 
 * @param http request
 * @return response from oauth2.userinfo
 */
function handleOAuth2Callback(req) {
  return new Promise((resolve, reject) => { 
    var code = req.query.code;
    if (code != null) {
       var token;
       oauth2.authorizationCode.getToken({
         code: code,
         redirect_uri: config.get('oauthCallbacks.msftCallbackUrl'),
         scope: scopes.join(' ')
       }, function (error, response) {
          if (error) {
              logger.error('Access token error: ', error.message);
              reject(error);
          } else {
          token = oauth2.accessToken.create(response);
          logger.debug('Token created: ', token.token);
          getUserInfo(token.token.access_token)
          .then((userinfo) => {
            userinfo.refresh_token = token.token.refresh_token
            resolve(userinfo);
          })
          .catch((err) => {
            logger.error(err);
          })
          }
       });
     }
  });
}

function getMsftAuthUrl() {
  var returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: config.get('oauthCallbacks.msftCallbackUrl'),
    scope: scopes.join(' '),
    // state : 12345,
    response_mode : 'query',
    prompt : 'consent'
  });
  logger.debug('Generated auth url: ' + returnVal);
  return returnVal;
}


/**
 * /__/login/msft
 */
router.get('/', function (req, res, next) {
  logger.info("getMsftAuthUrl()", getMsftAuthUrl()+ '&prompt=consent')
  res.redirect(getMsftAuthUrl()+ '&approval_prompt=force')
});

/**
 * /__/login/msft/oauthcallback
 */
router.get('/oauthcallback',
  function (req, res, next) {
    let userInfo = null;
    handleOAuth2Callback(req)
      //retrieve userinfo from msft
      .then((userinfo) => {
        userInfo = userinfo;
        logger.info('userinfo from msft', userInfo);
        if (userInfo.hd == null) {
          var domain = userInfo.userPrincipalName.replace(/.*@/, "");
          if (msftEmailDomains.indexOf(domain) > -1) {
            userInfo.hd = userInfo.userPrincipalName;
          } else {
            userInfo.hd = domain;
          }
        }
        logger.info('user_login', { 'org': userInfo.hd });
        return auth.authenticateUser(
          res,
          req,
          'msft', 
          userInfo.hd,
          userInfo.userPrincipalName, 
          userInfo.givenName, 
          userInfo.surname, 
          '', 
          userInfo.refresh_token);
      })
      .catch(err => {
        logger.error('routing error', err);
        //return err
      });
  });

function getUserInfo(token) {
  return new Promise((resolve, reject) => { 
  // Create a Graph client
  var client = microsoftGraph.Client.init({
    authProvider: (done) => {
      // Just return the token
      done(null, token);
    } 
  });

  // Get the Graph /Me endpoint to get user Info
  client
    .api('/me')
    .get((err, res) => {
      if (err) {
        reject(err);
      } else {
        logger.debug("res:", res);
        resolve(res);
      }
    });
 });
}

module.exports = router;