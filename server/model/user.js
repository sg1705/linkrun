
'use strict';

const config = require('config');


class User {
  
  constructor() {
    var ModelService = require(`./model-service.js`);
    this.modelService = new ModelService('User');   
  }

  getModel () {
    return this.modelService;
  }


  /**
   * Create a new user.
   */
  createUser(orgId, refresh_token, email, fName, lName, picture) {
    var userData = {};
    userData["orgId"] = orgId;
    userData["refresh_token"] = refresh_token;
    userData["email"] = email;
    userData["fName"] = fName;
    userData["lName"] = lName;
    userData["picture"] = picture;
    console.log("userData", userData);
    return this.getModel().create(userData);
  }

  /**
   * Update an existing user.
   */
  updateUser(uid, orgId, refresh_token, email, fName, lName, picture) {
    var userData = {};
    userData["orgId"] = orgId;
    userData["refresh_token"] = refresh_token;
    userData["email"] = email;
    userData["fName"] = fName;
    userData["lName"] = lName;
    userData["picture"] = picture;
    console.log("userData", userData);
    return this.getModel().update (uid, userData);
  }

  /**
   * Retrieve a user.
   */
  getUser(uid) {
    return this.getModel().read(uid);
  }

  /**
   * Delete a user.
   */
  deleteUser(uid) {
    return this.getModel().delete(uid);
  }

  /**
   * Retrieve a user by column
   */
  readByColumn (columnName, columnValue) {
    return this.getModel().readByColumn (columnName, columnValue);
  }

}

module.exports = User;
