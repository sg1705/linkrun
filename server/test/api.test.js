
'use strict';

const assert = require(`assert`);
const config = require(`./config`);
const utils = require(`nodejs-repo-tools`);

module.exports = (DATA_BACKEND) => {
  describe(`link.api.js`, () => {
    let ORIG_DATA_BACKEND;
    let id;

    before(() => {
      // const appConfig = require(`config`);
      // ORIG_DATA_BACKEND = appConfig.get(`db.DATA_BACKEND`);
      // appConfig.set(`DATA_BACKEND`, DATA_BACKEND);
    });

    it(`should create a link`, (done) => {
      utils.getRequest(config)
        .post(`/api/links`)
        .send({ gourl: `beep` })
        .expect(200)
        .expect((response) => {
          id = response.body.id;
          assert.ok(response.body.id);
          assert.equal(response.body.gourl, `beep`);
        })
        .end(done);
    });

    it(`should list links`, (done) => {
      // Give Datastore time to become consistent
      setTimeout(() => {
        utils.getRequest(config)
          .get(`/api/links`)
          .expect(200)
          .expect((response) => {
            assert.ok(Array.isArray(response.body.items));
            assert.ok(response.body.items.length >= 1);
          })
          .end(done);
      }, 1000);
    });

    it(`should delete a link`, (done) => {
      utils.getRequest(config)
        .delete(`/api/links/${id}`)
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

