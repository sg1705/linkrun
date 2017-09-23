const expect = require('chai').expect
const SC = require('./spell-checker')
const dict = new Set(['test', 'dictionary'])

const sc = new SC.spellChecker();
sc.setDict(dict);

describe('Spell Correction', ()=>{
	it('should correct tess to test', () => expect(sc.correct('tess')).to.eql('test'))
	it('should correct tets to test', () => expect(sc.correct('tets')).to.eql('test'))
	it('should correct butter to null', () => expect(sc.correct('butter')).to.eql(null))
})