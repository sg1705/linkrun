
'use strict';

const config = require('config');
var logger   = require('./logger.js');

class Org {
  
  constructor() {
    var ModelService = require(`./model-service.js`);
    this.modelService = new ModelService('Org');
  }

  getModel () {
    return this.modelService;
  }

  /**
   * Create a new Org.
   */
  createOrg(orgName, orgShortName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgShortName"] = orgShortName;
    orgData["orgType"] = orgType;
    logger.info ("creating org", orgData);
    return this.modelService.create(orgData);
  }

   /**
   * Add Org Short Name in org.
   */
  addOrgShortName(orgid, orgName, orgShortName, orgType, isPublicLinksAllowed) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgShortName"] = orgShortName;
    orgData["isPublicLinksAllowed"] = isPublicLinksAllowed;
    orgData["orgType"] = orgType;
    logger.info ("adding org Short Name", orgData);
    return this.modelService.update (orgid, orgData);
  }
  
  /**
   * Update an existing Org.
   */
  updateOrg(orgid, orgName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgType"] = orgType;
    logger.info ("updating org", orgData);
    return this.modelService.update (orgid, orgData);
  }

  /**
   * Retrieve a Org.
   */
  getOrg(orgid) {
    return this.getModel().read(orgid);
  }

  getOrgByName(orgName) {
    return this.modelService.readByColumn('orgName', orgName);
  }

  getOrgByShortName(orgShortName) {
    return this.modelService.readByColumn('orgShortName', orgShortName);
  }

  /**
   * Delete a Org.
   */
  deleteOrg(orgid) {
    logger.info ("deleting org", {'orgid':orgid});
    return this.getModel().delete(orgid);
  }
 
  /**
   * Retrieve a Org by column
   */
  readByColumn (columnName, columnValue) {
    return this.getModel().readByColumn (columnName, columnValue);
  }

}

module.exports = Org;
