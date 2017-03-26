
'use strict';

const config = require('config');

getModel () {
    return require(`./model-${config.get('db.DATA_BACKEND')}`);
}

class Org {
  
  Org {
    getModel().setKind("Org");
  }

  /**
   * Create a new Org.
   */
  createOrg(orgName, orgType, cb) {
    var orgData = {};
    orgData["orgNmae"] = orgName;
    orgData["orgType"] = orgType;
    console.log("OrgData", orgData);
    getModel().create(orgData, cb);
  }
  
  /**
   * Update an existing Org.
   */
  updateOrg(orgid, orgName, orgType, cb) {
    var orgData = {};
    orgData["orgNmae"] = orgName;
    orgData["orgType"] = orgType;
    console.log("OrgData", orgData);
    getModel().update (orgid, orgData, cb);
  }

  /**
   * Retrieve a Org.
   */
  getOrg(orgid, cb) {
    getModel().read(orgid, cb);
  }

  /**
   * Delete a Org.
   */
  deleteOrg(orgid, cb) {}
    getModel().delete(orgid, cb);
  }
}

module.exports = Org;
