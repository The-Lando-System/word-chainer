var chainerHelper = require('./chainerHelper');

/*=========================
 * Given an array of words, find all possible word chains.
 * Return an object whose keys are the base words and values
 * are the chains of words 
 **/
var findAllChains = function(dictionary){

  // Construct an object where each property is an array of words with the same length.
  // This makes it easy to check for the next candidate words in a chain. For example,
  // if I am checking for the next word in a chain starting with 'cat', I only need to
  // check against 4 letter words
  var wordObj = {};
  for (var i=0; i<dictionary.length; i++){
    var key = dictionary[i].length;
    if (!wordObj.hasOwnProperty(key)){
      wordObj[key] = [];
    }
    wordObj[key].push(dictionary[i]);
  }

  // This object will hold words that have already been added to a chain.
  // An object was used because it is faster to check if properties in an
  // object exist than to loop through an array
  var usedWords = {}; 

  // Build all possible chains when given a word
  var getChainsForWord = function(word){
    var chainsForWord = [];

    // Call this recursively for each word in the chain being built.
    // This is first called with the base word (e.g. 'a') then called
    // for each subsequent word in the chain (e.g. 'ab', 'at', etc.)
    var getNextWordsInChain = function(word){
      if (wordObj.hasOwnProperty(word.length+1)){
        var nextWords = chainerHelper.findWordsInList(word,wordObj[word.length+1]);
        for (var j=0; j<nextWords.length; j++) {
          if (!usedWords.hasOwnProperty(nextWords[j])){
            usedWords[nextWords[j]] = 1;
            chainsForWord.push(nextWords[j]);
            getNextWordsInChain(nextWords[j]);
          }
      	}
      }
    }
    getNextWordsInChain(word);
    return chainsForWord;
  };

  // Call the chaining function for each word in the dictionary. By skipping
  // words that have already been used in the chain, we avoid O(n * k^j) complexity where
  // n is the number of words in the dictionary, k is the average number of words at a
  // certain length, and j is the number of different word lengths in the dictionary 
  // (e.g. a dictionary containing only 'a','at','ate' has 3 different word lengths)
  var chains = {};
  for (var i=0; i<dictionary.length; i++) {
    if (!usedWords.hasOwnProperty(dictionary[i])){
      chains[dictionary[i]] = getChainsForWord(dictionary[i]);
    }
  }

  return chains;
};

/*=========================
 * This is the main method invoked by the router. It calls methods to find all word chains
 * and will return the longest chain with the time it took to compute it
 **/
var getLongestChain = function(dictionary){
  console.log("in the chainer");
  var startTime = new Date().getTime();
  var longestChain = chainerHelper.findLongestChain(findAllChains(dictionary));
  var endTime = new Date().getTime();
  return {chain:longestChain,time:(endTime-startTime)};
};

module.exports.getLongestChain = getLongestChain;