
'use strict';

const config = require('config');

class Org {
  
  constructor() {
    var ModelService = require(`./model-service.js`);
    console.log(ModelService);
    this.modelService = new ModelService('Org');
    this.lo
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
    console.log("create_org=", orgData);
    return this.modelService.create(orgData);
  }
  
  /**
   * Update an existing Org.
   */
  updateOrg(orgid, orgName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgType"] = orgType;
    console.log("create_org=", orgData);
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
    console.log("delete_org=", orgid);
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
