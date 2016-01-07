var clone = function(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};

var findLongestChain = function(chains){

  var longestChain = {words:[],chainLength:0};

  for (var word in chains){

    var longestChainForWord = [word];
    var testChain = [word];
    var chainArray = chains[word];

    for (var i=0; i<chainArray.length; i++){
      if (chainArray[i].length>testChain[testChain.length-1].length){
        testChain.push(chainArray[i]);
      } else {
        if (testChain.length>longestChainForWord.length){
          longestChainForWord = clone(testChain);
        }
        var elemsToSplice = (testChain[testChain.length-1].length-chainArray[i].length)+1;
        testChain.splice(testChain.length-elemsToSplice,elemsToSplice);
        testChain.push(chainArray[i]);
      }
    }

    if (testChain.length>longestChainForWord.length){
      longestChainForWord = clone(testChain);
    }

    if (longestChainForWord.length>longestChain.chainLength){
      longestChain.words = longestChainForWord;
      longestChain.chainLength = longestChainForWord.length;
    }

  }

  return longestChain;
};

module.exports.findLongestChain = findLongestChain;