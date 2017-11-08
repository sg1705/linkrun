const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);
const proxyquire = require('proxyquire');
const ds = require('@google-cloud/datastore')

describe('Model Service', function() {

    context('toDatastore', function() {
        const obj = {
            k1: 'v1',
            k2: 'v2'
        };
        const ModelService = require('./model-service');
        const ms = new ModelService('Link'); 
        it('transform input obj with no exclude', function(){
            const result = [
                { 
                    name: 'k1',
                    value: 'v1',
                    excludeFromIndexes: false
                },
                {
                    name: 'k2',
                    value: 'v2',
                    excludeFromIndexes: false
                }
            ]
            ms.toDatastore(obj, null).should.deep.equal(result)
        })
 
        it('transform input obj with exclude k2', function(){
            const result = [
                { 
                    name: 'k1',
                    value: 'v1',
                    excludeFromIndexes: false
                },
                {
                    name: 'k2',
                    value: 'v2',
                    excludeFromIndexes: true
                }
            ]
            ms.toDatastore(obj, ['k2']).should.deep.equal(result)
        })
    })


})