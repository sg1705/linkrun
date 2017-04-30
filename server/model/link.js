
'use strict';

const config     = require('config');
var logger       = require('./logger.js');

class Link {

  constructor() {
    var ModelService = require(`./model-service.js`);
    this.modelService = new ModelService('Link'); 
  }

  getModel () {
    return this.modelService;
  }

  /**
   * Create a new link.
   */
createLink(orgId, userId, gourl, url, description) {
  return new Promise((resolve, reject) => {
    this.getModel().readByColumns('gourl', gourl, 'orgId', orgId).then(linkEntities => {
      if (linkEntities.entities.length == 0) {
        var linkData = {};
        linkData["orgId"] = orgId;
        linkData["userId"] = userId;
        linkData["gourl"] = gourl;
        linkData["url"] = url;
        linkData["description"] = description;
        logger.debug("creating_link", linkData);
        resolve(this.getModel().create(linkData));
      } else {
          logger.debug("link_already_exists ", entity.gourl);
          reject("link_already_exists");
      }  
    });
   })
  }

  /**
   * Update an existing link.
   */
  updateLink(id, orgId, userId, gourl, url, description) {
    this.getModel().read(id).then(entity => {
      if(entity.userId == userId) {
        var linkData = {};
        linkData["orgId"] = orgId;
        linkData["userId"] = userId;
        linkData["gourl"] = gourl;
        linkData["url"] = url;
        linkData["description"] = description;
        logger.debug("updating_link", linkData);
        return this.getModel().update (id, linkData);
      } else {
         logger.error("acl_warning. Link is not owned by requested user ",  entity.userId);
         return new Promise((resolve, reject) => {
                    reject("acl_warning. Link is not owned by requested user");
            });
      }});   
  }

  /**
   * Retrieve a link.
   */
  getLinkByGoLink(linkName, orgId) {
    return this.getModel().readByColumns('gourl', linkName, 'orgId', orgId);
  }

  /**
   * Returns a Set of all the short links
   */
  getGourls(orgId){
    return this.getModel().filterByColumn('gourl', 'orgId', orgId);
  }


  /**
   * Retrieve a link for given user
   */
  getLinksByUser(userId) {
    return this.getModel().readByColumn('userId', userId);
  }

  /**
   * Delete a link.
   */
  deleteLink(userId, linkId) {
     this.getModel().read(linkId).then(entity => {
      if(entity.userId == userId) {
        logger.log("deleting_link", linkId);
        return this.getModel().delete(linkId);
      } else {
        logger.error("acl_error. Link is not owned by requested user ",  entity.userId);
        return new Promise((resolve, reject) => {
                    reject("acl_warning. Link is not owned by requested user");
        });
      }}); 
  }

  /**
   * Retrieve a link by column 
   */
  readByColumn (columnName, columnValue) {
    return this.getModel().readByColumn (columnName, columnValue);
  }
}

module.exports = Link;
