var chainerHelper = require('./chainerHelper');

var findAllChains = function(dictionary){

  var wordObj = {};
  for (var i=0; i<dictionary.length; i++){
    var key = dictionary[i].length;
    if (!wordObj.hasOwnProperty(key)){
      wordObj[key] = [];
    }
    wordObj[key].push(dictionary[i]);
  }

  var containsLetters = function(str1, str2){
    var letters1 = str1.split("");
    for (var i=0; i<str2.length; i++){
      if (letters1.indexOf(str2[i]) === -1){
        return false;
      } else {
        letters1.splice(letters1.indexOf(str2[i]),1);
      }
    }
    return true;
  };

  var findWordInList = function(word,wordList){
    nextWords = [];
    for (var i=0; i<wordList.length; i++) {
      if (containsLetters(wordList[i],word)) {
        nextWords.push(wordList[i]);
      }
    }
    return nextWords;
  };

  // Keep a running list of words already used in chains
  var usedWords = {};

  // Loop through starting words here:
  var getChainsForWord = function(word){
    var chainsForWord = [];
    var getNextWordsInChain = function(word){
      if (wordObj.hasOwnProperty(word.length+1)){
        var nextWords = findWordInList(word,wordObj[word.length+1]);
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

  var chains = {};
  for (var i=0; i<dictionary.length; i++) {
    if (!usedWords.hasOwnProperty(dictionary[i])){
      chains[dictionary[i]] = getChainsForWord(dictionary[i]);
    }
  }

  return chains;
};

var getLongestChain = function(dictionary){
  var startTime = new Date().getTime();
  var longestChain = chainerHelper.findLongestChain(findAllChains(dictionary));
  var endTime = new Date().getTime();
  return {chain:longestChain,time:(endTime-startTime)};
};

module.exports.getLongestChain = getLongestChain;