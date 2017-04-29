
'use strict';

const config = require('config');
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
  createLink(orgId, uid, gourl, url, description) {
    var linkData = {};
    linkData["orgId"] = orgId;
    linkData["uid"] = uid;
    linkData["gourl"] = gourl;
    linkData["url"] = url;
    linkData["description"] = description;
    logger.log("creating_link", linkData);
    return this.getModel().create(linkData);
  }

  /**
   * Update an existing link.
   */
  updateLink(id, orgId, uid, gourl, url, description) {
    var linkData = {};
    linkData["orgId"] = orgId;
    linkData["uid"] = uid;
    linkData["gourl"] = gourl;
    linkData["url"] = url;
    linkData["description"] = description;
    logger.log("updating_link", linkData);
    return this.getModel().update (id, linkData);
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
  deleteLink(id) {
    logger.log("deleting_link", id);
    return getModel().delete(id);
  }

  /**
   * Retrieve a link by column 
   */
  readByColumn (columnName, columnValue) {
    return getModel().readByColumn (columnName, columnValue);
  }
}

module.exports = Link;
