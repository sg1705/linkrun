const chai = require('chai');
const should = chai.should();
const SC = require('./spell-checker');


describe('Spell Checker', function() {
    const dict = new Set(['test', 'dictionary']);
    const sc = new SC.spellChecker();
    sc.setDict(dict);
    context('Correct', function() {
        it('should correct tess to test', function() {
            sc.correct('tess').should.equal('test');
        });
        it('should correct tets to test', function() {
            sc.correct('tets').should.equal('test');
        });
        it('should correct butter to null', function() {
            should.not.exist(sc.correct('butter'));
        });
    });
});
