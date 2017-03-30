
'use strict';

const config = require('config');

function getModel () {
  return require(`./model-${config.get('db.DATA_BACKEND')}`);
}

class User {
  
  constructor() {
    getModel().setKind("User");
  }

  /**
   * Create a new user.
   */
  createUser(orgId, refresh_token, email, fName, lName, picture, cb) {
    var userData = {};
    userData["orgId"] = orgId;
    userData["refresh_token"] = refresh_token;
    userData["email"] = email;
    userData["fName"] = fName;
    userData["lName"] = lName;
    userData["picture"] = picture;
    console.log("userData", userData);
    getModel().create(userData, cb);
  }

  /**
   * Update an existing user.
   */
  updateUser(uid, orgid, refresh_token, email, fName, lName, picture, cb) {
    var userData = {};
    userData["orgId"] = orgId;
    userData["refresh_token"] = refresh_token;
    userData["email"] = email;
    userData["fName"] = fName;
    userData["lName"] = lName;
    userData["picture"] = picture;
    console.log("userData", userData);
    getModel().update (uid, userData, cb);
  }

  /**
   * Retrieve a user.
   */
  getUser(uid, cb) {
    getModel().read(uid, cb);
  }

  /**
   * Delete a user.
   */
  deleteUser(uid, cb) {
    getModel().delete(uid, cb);
  }

  /**
   * Retrieve a user by column
   */
  readByColumn (columnName, columnValue, cb) {
    getModel().readByColumn (columnName, columnValue, cb);
  }

}

module.exports = User;
