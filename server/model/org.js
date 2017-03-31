
'use strict';

const config = require('config');

// function getModel () {
//     var modelService = require(`./model-service.js`);
//     return new modelService().setKind('Org');
// }

class Org {
  
  constructor() {
    var ModelService = require(`./model-service.js`);
    console.log(ModelService);
    this.modelService = new ModelService('Org')
    // return new modelService().setKind('User');      
    // getModel().setKind("User");
  }

  getModel () {
    console.log(this.modelService);
    return this.modelService;
  }

  /**
   * Create a new Org.
   */
  createOrg(orgName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgType"] = orgType;
    console.log("OrgData", orgData);
    return this.modelService.create(orgData);
  }
  
  /**
   * Update an existing Org.
   */
  updateOrg(orgid, orgName, orgType) {
    var orgData = {};
    orgData["orgName"] = orgName;
    orgData["orgType"] = orgType;
    console.log("OrgData", orgData);
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
