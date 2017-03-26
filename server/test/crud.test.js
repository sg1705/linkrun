
'use strict';

const assert = require(`assert`);
const config = require(`./config`);
const utils = require(`nodejs-repo-tools`);

module.exports = (DATA_BACKEND) => {
  describe(`crud.js`, () => {
    let ORIG_DATA_BACKEND;

    before(() => {
      const appConfig = require(`../config`);
      ORIG_DATA_BACKEND = appConfig.get(`DATA_BACKEND`);
      appConfig.set(`DATA_BACKEND`, DATA_BACKEND);
    });

    describe(`/links`, () => {
      let id;

      // setup a link
      before((done) => {
        utils.getRequest(config)
          .post(`/api/links`)
          .send({ title: `my link` })
          .expect(200)
          .expect((response) => {
            id = response.body.id;
            assert.ok(response.body.id);
            assert.equal(response.body.title, `my link`);
          })
          .end(done);
      });

      it(`should show a list of links`, (done) => {
        // Give Datastore time to become consistent
        setTimeout(() => {
          const expected = `<div class="media-body">`;
          utils.getRequest(config)
            .get(`/links`)
            .expect(200)
            .expect((response) => {
              assert.equal(response.text.includes(expected), true);
            })
            .end(done);
        }, 2000);
      });

      it(`should handle error`, (done) => {
        utils.getRequest(config)
          .get(`/links`)
          .query({ pageToken: `badrequest` })
          .expect(500)
          .end(done);
      });

      // delete the link
      after((done) => {
        if (id) {
          utils.getRequest(config)
            .delete(`/api/links/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    });

    describe(`/links/add`, () => {
      let id;

      it(`should post to add link form`, (done) => {
        utils.getRequest(config)
          .post(`/links/add`)
          .send(`title=my%20link`)
          .expect(302)
          .expect((response) => {
            const location = response.headers.location;
            const idPart = location.replace(`/links/`, ``);
            if (require(`../config`).get(`DATA_BACKEND`) !== `mongodb`) {
              id = parseInt(idPart, 10);
            } else {
              id = idPart;
            }
            assert.equal(response.text.includes(`Redirecting to /links/`), true);
          })
          .end(done);
      });

      it(`should show add link form`, (done) => {
        utils.getRequest(config)
          .get(`/links/add`)
          .expect(200)
          .expect((response) => {
            assert.equal(response.text.includes(`Add link`), true);
          })
          .end(done);
      });

      // delete the link
      after((done) => {
        if (id) {
          utils.getRequest(config)
            .delete(`/api/links/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    });

    describe(`/links/:link/edit & /links/:link`, () => {
      let id;

      // setup a link
      before((done) => {
        utils.getRequest(config)
          .post(`/api/links`)
          .send({ title: `my link` })
          .expect(200)
          .expect((response) => {
            id = response.body.id;
            assert.ok(response.body.id);
            assert.equal(response.body.title, `my link`);
          })
          .end(done);
      });

      it(`should update a link`, (done) => {
        const expected = `Redirecting to /links/${id}`;
        utils.getRequest(config)
          .post(`/links/${id}/edit`)
          .send(`title=my%20other%20link`)
          .expect(302)
          .expect((response) => {
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      it(`should show edit link form`, (done) => {
        const expected =
          `<input type="text" name="title" id="title" value="my other link" class="form-control">`;
        utils.getRequest(config)
          .get(`/links/${id}/edit`)
          .expect(200)
          .expect((response) => {
            console.log('RT', response.text);
            console.log('expected', expected);
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      it(`should show a link`, (done) => {
        const expected = `<h4>my other link&nbsp;<small></small></h4>`;
        utils.getRequest(config)
          .get(`/links/${id}`)
          .expect(200)
          .expect((response) => {
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      it(`should delete a link`, (done) => {
        const expected = `Redirecting to /links`;
        utils.getRequest(config)
          .get(`/links/${id}/delete`)
          .expect(302)
          .expect((response) => {
            id = undefined;
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      // clean up if necessary
      after((done) => {
        if (id) {
          utils.getRequest(config)
            .delete(`/api/links/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    });

    after(() => {
      require(`../config`).set(`DATA_BACKEND`, ORIG_DATA_BACKEND);
    });
  });
};
