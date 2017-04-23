

'use strict';

const assert = require(`assert`);
const config = require(`./config`);
const utils = require(`nodejs-repo-tools`);

module.exports = (DATA_BACKEND) => {
  describe(`user.api.js`, () => {
    let ORIG_DATA_BACKEND;
    let id;

    before(() => {
      // const appConfig = require(`config`);
      // ORIG_DATA_BACKEND = appConfig.get(`DATA_BACKEND`);
      // appConfig.set(`DATA_BACKEND`, DATA_BACKEND);
    });

    it(`should create a user`, (done) => {
      utils.getRequest(config)
        .post(`/api/users`)
        .send({ orgId: 'orgId', gourl: `beep` })
        .expect(200)
        .expect((response) => {
          id = response.body.id;
          assert.ok(response.body.id);
          assert.equal(response.body.gourl, `beep`);
        })
        .end(done);
    });

    it(`should delete a user`, (done) => {
      utils.getRequest(config)
        .delete(`/api/users/${id}`)
        .expect(200)
        .expect((response) => {
          assert.equal(response.text, `OK`);
        })
        .end(done);
    });

    after(() => {
      // require(`../config`).set(`DATA_BACKEND`, ORIG_DATA_BACKEND);
    });
  });
};

