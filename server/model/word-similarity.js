'use strict';
var w2v = require( 'word2vec' );

class WS {
    constructor() {
        w2v.loadModel('model.txt', (err, model)=> this.model = model)

    } 

  sort(links, word){
    // let vecs = this.model.getVectors(links);
    let wordSim = links.map( link => [link.link, this.model.similarity(word, link.link)])
    wordSim.sort( (w1,w2)=>w1[1]-w2[1])
    return wordSim.map(w => w[0]);
    
  }
}
module.exports = WS;
