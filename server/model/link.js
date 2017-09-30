
'use strict';
var GA = require('./google-analytics-tracking.js')

const config     = require('config');
var logger       = require('./logger.js');
let ga = new GA();

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
   * First check whether the link exists or not
   * By default isExposedAsPublicLink is false
   */
createLink(orgId, userId, gourl, url, description) {
  this.createLink(orgId, userId, gourl, url, description, false); 
 }
  /**
   * Create a new link.
   * First check whether the link exists or not
   */
createLink(orgId, userId, gourl, url, description, acl) {
  return new Promise((resolve, reject) => {
    this.getModel().readByColumns('gourl', gourl, 'orgId', orgId).then(linkEntities => {
      if (linkEntities.entities.length == 0) {
        var linkData = {};
        linkData["orgId"] = orgId;
        linkData["userId"] = userId;
        linkData["gourl"] = gourl.trim().toLowerCase();
        linkData["url"] = url.trim();
        linkData["description"] = description;
        linkData["acl"] = acl;
        logger.info("creating_link", linkData);
        ga.trackEvent(userId, orgId, 'Link', 'create', linkData["gourl"], '100')      
        resolve(this.getModel().create(linkData));
      } else {
          logger.debug("link_already_exists ", entity.gourl);
          ga.trackEvent(userId, orgId, 'Link', 'create', linkData["gourl"]+'_already_exists', '100')          
          reject("link_already_exists");
      }  
    });
   })
  }

  /**
   * Update an existing link.
   * First check whether the link is owned by userId
   * By default isExposedAsPublicLink is false
   */
  updateLink(id, orgId, userId, gourl, url, description) {
    this.updateLink(id, orgId, userId, gourl, url, description, false);
  }
  /**
   * Update an existing link.
   * First check whether the link is owned by userId
   */
  updateLink(id, orgId, userId, gourl, url, description, acl) {
    return new Promise((resolve, reject) => {
      this.getModel().read(id).then(entity => {
        if(entity.userId == userId) {
          var linkData = {};
          linkData["orgId"] = orgId;
          linkData["userId"] = userId;
          linkData["gourl"] = gourl.trim().toLowerCase();
          linkData["url"] = url.trim();
          linkData["description"] = description;
          linkData["acl"] = acl;
          logger.info("updating_link", linkData);
          ga.trackEvent(userId, orgId, 'Link', 'update', linkData["gourl"], '100')              
          resolve(this.getModel().update (id, linkData));
        } else {
          logger.error("unauthorized_update_links ",  {'userId' :entity.userId, 'linkId' :entity.id });
          ga.trackEvent(userId, orgId, 'Link', 'update', linkData["gourl"]+'_unauthorized', '100')                    
          reject("unauthorized_update_links");
        }
      });  
    })
  }

  /**
   * Retrieve a link
   */
  getLink(linkId) {
    return this.getModel().read(linkId);
  }


  /**
   * Retrieve a link by linkName and orgId
   */
  getLinkByGoLink(linkName, orgId) {
    return this.getModel().readByColumns('gourl', linkName.toLowerCase(), 'orgId', orgId);
  }

  /**
   * Returns a Set of all the short links
   */
  getGourls(orgId){
    return this.getModel().filterByColumn('gourl', 'orgId', orgId);
  }

  /**
   * Returns a list of all the short links for given orgId
   */
  getLinksByOrgId(orgId){
    return this.getModel().readByColumn('orgId', orgId);
  }



  /**
   * Retrieve a link for a given user
   */
  getLinksByUser(userId) {
    return this.getModel().readByColumn('userId', userId);
  }

  /**
   * Delete a link.
   * First check whether the link is owned by userId
   */
  deleteLink(userId, orgId, linkId) {
     return new Promise((resolve, reject) => {
      this.getModel().read(linkId).then(entity => {
        if(entity.userId == userId) {
          logger.info("deleting_link", {'link' : linkId});
          ga.trackEvent(userId, orgId, 'Link', 'delete', linkId, '100')                        
          resolve(this.getModel()._delete(linkId));
        } else {
          logger.error("unauthorized_delete_links ",  entity.userId);
          ga.trackEvent(userId, orgId, 'Link', 'update', linkId+'_unauthorized', '100')                    
          reject("unauthorized_delete_links");
        }
      }); 
     })
  }

  /**
   * Retrieve a link by column 
   */
  readByColumn (columnName, columnValue) {
    return this.getModel().readByColumn (columnName, columnValue);
  }
}

module.exports = Link;
