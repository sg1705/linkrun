
'use strict';

const config = require('config');
var Logger   = require('./logger.js');

class Org {
  
  constructor() {
    var ModelService = require(`./model-service.js`);
    this.modelService = new ModelService('Org');
    this.logger = new Logger();
  }

  getModel () {
    return this.modelService;
  }

  /**
   * Create a new Org.
   */
  createOrg(orgName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgType"] = orgType;
    this.logger.info ("creating org", orgData);
    return this.modelService.create(orgData);
  }
  
  /**
   * Update an existing Org.
   */
  updateOrg(orgid, orgName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgType"] = orgType;
    this.logger.info ("updating org", orgData);
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


  /**
   * Delete a Org.
   */
  deleteOrg(orgid) {
    this.logger.info ("deleting org", {'orgid':orgid});
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
