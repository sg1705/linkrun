'use strict';

var spellChecker = function () {
	var that = {},
		filter = /([a-z]+)/g,
		alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		dict = new Set();
	
	var setDict = function(words) {
		dict = words;
	};
	
	var edits1 = function (words) {
		var edits1Set = new Set();
		for(var word of words) {
			// var word = words[w];
			for (var i = 0; i <= word.length; i++) {
				//splits (a & b)
				var a = word.slice(0,i),
					b = word.slice(i),
					c = b.slice(1),
					d = b.slice(2);
				if (b != '') {
					//deletes
					edits1Set.add(a + c);
					//transposes
					if (b.length > 1) {
						edits1Set.add(a + b.charAt(1) + b.charAt(0) + d);
					}
					//replaces & inserts
					for (var j = 0; j < alphabets.length; j++) {
						edits1Set.add(a + alphabets[j] + c);//replaces
						edits1Set.add(a + alphabets[j] + b);//inserts
					}
				}
				else {
					//inserts (remaining set for b == '')
					for (var j = 0; j < alphabets.length; j++) {
						edits1Set.add(a + alphabets[j] + b);
					}
				}
			}
		}
		return edits1Set;
	};
	
	var edits2 = function (words) {
		return edits1(edits1(words));
	};



	var correct = function (word) {

		if (dict.has(word)) return word;


		let editsSet = edits1([word]);

		for (let w of editsSet){
			if (dict.has(w)) {
				return w;
			}
		}

		editsSet = edits1(editsSet);
		for (let w of editsSet){
			if (dict.has(w)) return w;
		}

		return null;
	};

	that.setDict = setDict;
	that.correct = correct;
	return that;
	
};

	

module.exports = {
    spellChecker: spellChecker
};