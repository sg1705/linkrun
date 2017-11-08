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
            const ORG_DATA = {orgName: ORG_NAME, orgType: ORG_TYPE};
            org.createOrg(ORG_NAME, ORG_TYPE);
            msCreateStub.should.have.been.calledWith(ORG_DATA);
        })

    })

    context('addOrgShortName', function() {
        let msUpdateStub;
        before(function(){
            msUpdateStub = sinon.stub(ModelService.prototype, 'update');
        })
        after(function(){
            msUpdateStub.restore();
        })
        it('should call modelService.update with correct data', function(){
            let ms = new ModelService('Org');
            const ORG_ID = '0';
            const ORG_NAME = 'a';
            const ORG_SHORT_NAME = 'b';
            const IS_PUBLIC_LINKS_ALLOWED = 'c';
            const ORG_TYPE = 'd';
            const ORG_DATA = {
                orgName: ORG_NAME, 
                orgShortName: ORG_SHORT_NAME, 
                isPublicLinksAllowed: IS_PUBLIC_LINKS_ALLOWED, 
                orgType: ORG_TYPE
            };
            org.addOrgShortName(ORG_ID, ORG_NAME, ORG_SHORT_NAME, ORG_TYPE, IS_PUBLIC_LINKS_ALLOWED);
            msUpdateStub.should.have.been.calledWith(ORG_ID, ORG_DATA);
        })
    })

    context('updateOrg', function() {
        let msUpdateStub;
        before(function(){
            msUpdateStub = sinon.stub(ModelService.prototype, 'update');
        })
        after(function(){
            msUpdateStub.restore();
        })
        it('should call modelService.update with correct data', function(){
            let ms = new ModelService('Org');
            const ORG_ID = '0';
            const ORG_NAME = 'a';
            const ORG_TYPE = 'd';
            const ORG_DATA = {
                orgName: ORG_NAME, 
                orgType: ORG_TYPE
            };
            org.updateOrg(ORG_ID, ORG_NAME, ORG_TYPE);
            msUpdateStub.should.have.been.calledWith(ORG_ID, ORG_DATA);
        })
    })

})