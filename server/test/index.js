
'use strict';

const config = require(`./config`);
const utils = require(`nodejs-repo-tools`);

describe(`${config.test}/`, () => {
  // if (!process.env.E2E_TESTS) {
  //   it(`should install dependencies`, (done) => {
  //     utils.testInstallation(config, done);
  //   }).timeout(120 * 1000);
  // }
  //require(`./app.test`);
  describe(`model/`, () => {
    const appConfig = require(`config`);
    const DATA_BACKEND = appConfig.get(`db.DATA_BACKEND`);
    console.log("DATA_BACKEND",DATA_BACKEND);
    if (DATA_BACKEND === `datastore` || process.env.TEST_DATASTORE) {
      require(`./api.test`)(`datastore`);
      //require(`./crud.test`)(`datastore`);
    }
  });
  describe(`model/`, () => {
    const appConfig = require(`config`);
    const DATA_BACKEND = appConfig.get(`db.DATA_BACKEND`);
    if (DATA_BACKEND === `datastore` || process.env.TEST_DATASTORE) {
      require(`./user.api.test`)(`datastore`);
    }
  });
});
