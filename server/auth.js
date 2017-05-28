'use strict';

var cookie = require('./cookie.js');
var logger = require('./model/logger.js');
var UserService = require('./model/user.js');
var OrgService = require('./model/org.js');
var helper = require('./helper.js');
var https = require('https');
/**
 * Check if user is logged in
 */
function isLoggedIn(req, res, next) {
  if (isUserIdSetInCookie(req)) {
    helper.clearRouteUrl(res);
    return next();
  }
  if (process.env.NODE_ENV == 'production') {
    res.redirect('https://link.run'+ '/_/');
  } else {
    res.redirect('/_/');
  }
}

function isUserIdSetInCookie(req) {
  var xsession = cookie.getXsession(req);
  if (xsession == null) {
    return false;
  }
  var userId = xsession.userId;  
  if (userId != null) {
    return true;
  }
  logger.info('UserId is not set in Session');
  return false;
}

function authenticateUser(res,req, authMethod, orgName, email, fName, lName, picture, refresh_token) {
  return new Promise((resolve, reject) => {
    let orgService = new OrgService();
    let userService = new UserService();
    orgService.getOrgByName(orgName)
    //retrieve org
    .then(orgEntities => {
      if (orgEntities.entities.length == 0) {
        //org doesn't exist
        return orgService.createOrg(orgName, authMethod)
          .then((orgEntity) => {
                return userService.getOrCreateUserByEmail(orgEntity.id, email, fName, lName, picture, refresh_token);
              });
          } else {
            // org exists
            let orgEntity = orgEntities.entities[0];
            return userService.getOrCreateUserByEmail(orgEntity.id, email, fName, lName, picture, refresh_token);
          }
      })
      .then(userEntity => {
        //set cookie
        cookie.setCookie(res, userEntity.id, userEntity.orgId);        
      })
      //retrieve user
      .then((data) => {
        let routeUrl = helper.getRouteUrl(req);
        logger.info('routing to 301' + routeUrl);
        helper.clearRouteUrl(res);
        res.redirect(301, routeUrl);
        resolve(true)
      })
      //error
      .catch(err => {
        logger.error('routing error', err);
        reject(err)
      });
  });




}

module.exports = {
    isLoggedIn: isLoggedIn,
    authenticateUser: authenticateUser
};