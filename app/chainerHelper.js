// ===========================================================
// This file contains helper functions for the word chainer.
// ===========================================================

/*=========================
 * Given two strings, return true if the characters in string 2
 * are contained in string 1. This also accounts for duplicate
 * characters. For example, containsLetters('seat','ass') returns false
 **/
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

/*=========================
 * Given a word and a list of words, return all words in the
 * list that contain all the characters in the word. For example,
 * if words was 'at' and the list was ['bat','boy','tar'], this
 * would return ['bat','tar']
 **/
var findWordsInList = function(word,wordList){
  var words = [];
  for (var i=0; i<wordList.length; i++) {
    if (containsLetters(wordList[i],word)) {
      words.push(wordList[i]);
    }
  }
  return words;
};

/*=========================
 * Safely clone any given object
 **/
var clone = function(obj) {
  if (obj === null || typeof obj != "object"){
    return obj;
  }
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)){
      copy[attr] = obj[attr];
    }
  }
  return copy;
};

/*=========================
 * This function accepts an object where each property is the starting word
 * of the chain and the value of that property is an array containing all
 * possible chains in the order they were built. Here is an example input:
 * chains = {
 *   'a' :['at','bat','brat','sat','task','tasks'],
 *   'is':['his','shin','hints','sip','lisp'],
 *   ... 
 * }
 * The longest chain for each starting word is found, and then from those
 * results, the longest overall chain is found and returned
 **/
var findLongestChain = function(chains){

  var longestChain = {words:[],chainLength:0};

  // Loop through each starting word
  for (var word in chains){

    var longestChainForWord = [word];
    var testChain = [word];
    var chainArray = chains[word];

    // Loop through the array of chain words. 
    for (var i=0; i<chainArray.length; i++){

      // Add to the test chain if the next word is bigger (and therefore is part of the chain)
      if (chainArray[i].length>testChain[testChain.length-1].length){
        testChain.push(chainArray[i]);

      // If the next word is not bigger, we are at the end of a chain
      } else {

        // If the test chain is the biggest chain for this starting word, save it in the
        // longestChainForWord object
        if (testChain.length>longestChainForWord.length){
          longestChainForWord = clone(testChain);
        }

        // To start looking for the next chain for the starting word, revert the test chain
        // back to the appropriate size. For example, if testChain was ['a','at','bat'] and
        // the current chainArray element is 'as', we need testChain to become ['a','as']
        var elemsToSplice = (testChain[testChain.length-1].length-chainArray[i].length)+1;
        testChain.splice(testChain.length-elemsToSplice,elemsToSplice);
        testChain.push(chainArray[i]);
      }
    }

    // Final check to see if the testChain is the longest chain in the case where the chainArray
    // ends with the longest chain
    if (testChain.length>longestChainForWord.length){
      longestChainForWord = clone(testChain);
    }

    // Check if the longest chain for the starting word is the overall longest chain
    if (longestChainForWord.length>longestChain.chainLength){
      longestChain.words = longestChainForWord;
      longestChain.chainLength = longestChainForWord.length;
    }

  }

  return longestChain;
};

module.exports.findLongestChain = findLongestChain;
module.exports.findWordsInList = findWordsInList;