
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const UserService = require(`./user.js`);
const cookieService = require('../cookie.js');
const Datastore = require('@google-cloud/datastore');

const userService = new UserService();

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
  userService.getUser(userId)
  .then(entity => {
    //create user object
    var userData = {};
    userData['id'] = entity[Datastore.KEY].id;
    console.log(entity[Datastore.KEY].id);
    userData["orgId"] = entity['orgId'];
    userData["email"] = entity['email'];
    userData["fName"] = entity['fName'];
    userData["lName"] = entity['lName'];
    userData["picture"] = entity['picture'];
    res.json(userData);
  }).catch(err => {
      console.log(err);
      res.clearCookie("userId");
      res.clearCookie("orgId");
      res.json(err);
      return;
  })
});


module.exports = router;
