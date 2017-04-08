
'use strict';

const config = require('config');
 
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
    console.log("create_link=", linkData);
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
    console.log("update_link=", linkData);
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
    console.log("delete_link=", id);
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
