
'use strict';

const config = require('config');
var Logger       = require('./logger.js');

class Link {

  constructor() {
    var ModelService = require(`./model-service.js`);
    this.modelService = new ModelService('Link'); 
    let logger = new Logger();
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
    this.logger.log("creating_link", linkData);
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
    this.logger.log("updating_link", linkData);
    return this.getModel().update (id, linkData);
  }

  /**
   * Retrieve a link.
   */
  getLinkByGoLink(linkName, orgId) {
    return this.getModel().readByColumns('gourl', linkName, 'orgId', orgId);
  }

  /**
   * Delete a link.
   */
  deleteLink(id) {
    this.logger.log("deleting_link", id);
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
