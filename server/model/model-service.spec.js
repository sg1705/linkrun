const chai = require('chai')
const ModelService = require(`./model-service.js`);
const modelService = new ModelService('Link');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised)
const expect = chai.expect

orgId = '---test-orgId'
userId = '---test-userId'
gourl = '---test-gourl'
url = 'http://test.url.com/--test-url'
description = '---test-description'

var linkData = {};
linkData["orgId"] = orgId;
linkData["userId"] = userId;
linkData["gourl"] = gourl;
linkData["url"] = url;
linkData["description"] = description;

function cleanTestData() {
    return modelService.readByColumns('gourl', gourl, 'orgId', orgId)
        // .then(result => {console.log(result); return result})
        .then((result => { return Promise.all(result.entities.map(e => modelService._delete(e.id))) }))
}

describe('Datastore model service', () => {
    it('should clean test data', () => {
        return expect(
            cleanTestData()
                .then(() => { return modelService.readByColumns('gourl', gourl, 'orgId', orgId) })
                .then(result => result.entities)
        ).to.eventually.have.length(0)
    })
    it('should store and then load the same data', () => {
        return expect(
            cleanTestData()
                .then(() => { return modelService.create(linkData) })
                .then(() => { return modelService.readByColumns('gourl', gourl, 'orgId', orgId) })
                .then(result => {
                    // console.log(result);
                    return result.entities[0];
                })
        ).to.eventually.deep.equal(linkData)
    })
})