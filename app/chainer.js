var chainerHelper = require('./chainerHelper');

var findChains = function(dictionary){

  var wordObjStartTime = new Date().getTime();
  var wordObj = {};
  for (var i=0; i<dictionary.length; i++){
    var key = dictionary[i].length;
    if (!wordObj.hasOwnProperty(key)){
      wordObj[key] = [];
    }
    wordObj[key].push(dictionary[i]);
  }
  var wordObjEndTime = new Date().getTime();
  console.log('Time to build word obj: ' + (wordObjEndTime-wordObjStartTime) + 'ms');

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

  var containsLetters2 = function(str1, str2){
  	str1 = str1.split("").sort().join("");
  	str2 = str2.split("").sort().join("");
  	return (str1.indexOf(str2) > -1);
  }; 

  var checkForWords = function(word,wordList){
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
    var getNextWords = function(word,lengthKey){
      if (wordObj.hasOwnProperty(lengthKey+1)){
        var nextWords = checkForWords(word,wordObj[lengthKey+1]);
        for (var j=0; j<nextWords.length; j++) {
          if (!usedWords.hasOwnProperty(nextWords[j])){
            usedWords[nextWords[j]] = 1;
            chainsForWord.push(nextWords[j]);
            getNextWords(nextWords[j],lengthKey+1);
          }
      	}
      }
    }
    getNextWords(word,word.length);
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

var getChain = function(dictionary){
  var startTime = new Date().getTime();
  var chainResults = chainerHelper.getLongestChain(findChains(dictionary));
  var endTime = new Date().getTime();
  var chains = {chain:chainResults,time:(endTime-startTime)};
  return chains;
};

module.exports.getChain = getChain;