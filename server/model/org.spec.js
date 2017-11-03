'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);
const proxyquire = require('proxyquire');
const ModelService = require('./model-service');
const Org = require('./org')
let org = new Org();

describe('org', function() {
    context('createOrg', function() {
        let msCreateStub;
        before(function(){
            msCreateStub = sinon.stub(ModelService.prototype, 'create');
        })
        after(function(){
            msCreateStub.restore();
        })
        it('should call modelService.create with correct data', function(){
            let ms = new ModelService('Org');
            const ORG_NAME = 'a';
            const ORG_TYPE = 'b';
            const orgData = {orgName: ORG_NAME, orgType: ORG_TYPE};
            org.createOrg(ORG_NAME, ORG_TYPE);
            msCreateStub.should.have.been.deep.calledWith(orgData);
        })

    })
})