
'use strict';

const config = require('config');

function getModel () {
  return require(`./model-${config.get('db.DATA_BACKEND')}`);
}

class Link {
  
  constructor() {
    getModel().setKind("Link");
  }

  /**
   * Create a new link.
   */
  createLink(orgId, uid, gourl, url, description, cb) {
    var linkData = {};
    linkData["orgId"] = orgId;
    linkData["uid"] = uid;
    linkData["gourl"] = gourl;
    linkData["url"] = url;
    linkData["description"] = description;
    console.log("linkData", linkData);
    getModel().create(linkData, cb);
  }

  /**
   * Update an existing link.
   */
  updateLink(id, orgId, uid, gourl, url, description, cb) {
    var linkData = {};
    linkData["orgId"] = orgId;
    linkData["uid"] = uid;
    linkData["gourl"] = gourl;
    linkData["url"] = url;
    linkData["description"] = description;
    console.log("linkData", linkData);
    getModel().update (id, linkData, cb);
  }

  /**
   * Retrieve a link.
   */
  getLink(id, cb) {
    getModel().read(id, cb);
  }

  /**
   * Delete a link.
   */
  deleteUser(id, cb) {
    getModel().delete(id, cb);
  }

  /**
   * Retrieve a link by column 
   */
  readByColumn (columnName, columnValue, cb) {
    getModel().readByColumn (columnName, columnValue, cb);
  }
}

module.exports = Link;
