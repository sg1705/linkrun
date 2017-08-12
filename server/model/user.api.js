
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const UserService = require(`./user.js`);
const OrgService = require(`./org.js`);
const cookieService = require('../cookie.js');
const Datastore = require('@google-cloud/datastore');

const userService = new UserService();
const orgService = new OrgService();

function getModel () {
  return require(`./model-${config.get('db.DATA_BACKEND')}`)();
}

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * GET /api/users/:id
 *
 * Retrieve a user.
 */
router.get('/', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  //create user object
  var userData = {};
  
  userService.getUser(userId)
  .then(entity => {
    userData['id'] = entity[Datastore.KEY].id;
    userData["orgId"] = entity['orgId'];
    userData["email"] = entity['email'];
    userData["fName"] = entity['fName'];
    userData["lName"] = entity['lName'];
    userData["picture"] = entity['picture'];
    return orgService.getOrg(userData['orgId']);
  })
  .then(orgEntity => {
    userData['orgName'] = orgEntity.orgName;
    res.json(userData);    
  })
  .catch(err => {
      console.log(err);
      res.clearCookie("userId");
      res.clearCookie("orgId");
      res.json(err);
      return;
  })
});


module.exports = router;
