
'use strict';

const config = require('config');
const EmailService = require('./email-service')
let emailService = new EmailService()

var logger   = require('./logger.js');
var GA = require('./google-analytics-tracking.js')

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
    logger.info("creating_user", {'email':email, 'orgId':orgId});
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
    logger.info("updating user", {'userId':uid, 'orgId':orgId});
    return this.getModel().update(uid, userData);
  }

  /**
   * Retrieve a user.
   */
  getUser(userId) {
    return this.getModel().read(userId);
  }

  /**
   * Delete a user.
   */
  deleteUser(userId) {
    logger.info("deleting user", userId);
    return this.getModel().delete(userId);
  }

  /**
   * Retrieve a user by column
   */
  readByColumn (columnName, columnValue) {
    return this.getModel().readByColumn (columnName, columnValue);
  }

  /**
   * Returns a user entity. If the user doesn't exist then it creates one
   * 
   * @param orgId
   * @param email
   * @param fName
   * @param lName
   * @param picture
   * @param refresh_token
   * @return user entity
   * 
   */
  getOrCreateUserByEmail(orgId, orgName, email, fName, lName, picture, refresh_token) {
    return new Promise((resolve, reject) => {
      this.readByColumn(
        'email',
        email)
        .then((userData) => {
          let ga = new GA();
          if (userData.entities.length > 0) {
            //user exists
            //update user
            let userEntity = userData.entities[0];
            logger.info('user exist', { 'userId': userEntity.id });
            this.updateUser(
              userEntity.id,
              userEntity.orgId,
              refresh_token,
              email,
              fName,
              lName,
              picture)
            .then((entity) => {
              resolve(entity);
            }).catch (err => {
              logger.error('rejected when updating user', err);
              reject(err);
            })
          } else {
            //user doesn't exist create user
            logger.info('user doesnt exist');
            this.createUser(
              orgId,
              refresh_token,
              email,
              fName,
              lName,
              picture)
            .then((entity) => {
              ga.trackEvent(entity.id, orgId, 'User', 'create', 'success', '100')
              emailService.sendEmail(email, 'welcome', fName, orgName, entity.id, orgId).catch((err)=>{
                // email sending error
                logger.error('rejected when sending email', err);
              });
              resolve(entity);
            }).catch(err => {
              logger.error('rejected when creating user', err);
              reject(err)
            });
          }
        });
    })
  }

  /*
  * Returns all users in the domain
  *
  * @param: orgId id of the org for which to return all users
  * @return: array of all users
  */
  getAllUsers(orgId) {
    var users = [];
    return new Promise((resolve, reject) => {
      this.readByColumn('orgId', orgId)
      .then(data => {
        data.entities.forEach(function(entity) {
          var userData = {}
          userData['id'] = entity['id'];
          userData["orgId"] = entity['orgId'];
          userData["email"] = entity['email'];
          userData["fName"] = entity['fName'];
          userData["lName"] = entity['lName'];
          userData["picture"] = entity['picture'];
          users.push(userData);
        }, this);
        resolve(users);
      })
      .catch(err => {
        logger.error('error when accessing all users', err);
        reject(err);
      })
    });
  }





}

module.exports = User;
