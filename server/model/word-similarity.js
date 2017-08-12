'use strict';
var w2v = require( 'word2vec' );
var config = require('config');

class WS {
    constructor() {
      if (config.get('features.wordSimilarity')=='true')
        w2v.loadModel('model.txt', (err, model)=> this.model = model)
    } 

  sort(links, word){
    if (config.get('features.wordSimilarity')!='true')
      return links;

    let wordSim = links.map( link => [link, this.model.similarity(word, link.gourl)])

    wordSim.sort( (w1,w2)=>w2[1]-w1[1])

    return wordSim.map(w => w[0]);
    
  }
}
module.exports = WS;
