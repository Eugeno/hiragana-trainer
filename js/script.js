'use strict';

var kana = 0;
var score = 0;
var falls = 0;

var ENTER_KEY_CODE = 13;
var ESCAPE_KEY_CODE = 27;

var kotae = document.querySelector('.kotae');
var shitsumon = document.querySelector('.shitsumon');
var tip = document.querySelector('.tip');

var rules = document.querySelector('.rules');
var rulesLink = document.querySelector('.rules-link');
var rulesOverlay = document.querySelector('.rules-overlay');

var winPopup = document.querySelector('.win');
var winOverlay = document.querySelector('.win-overlay');

var questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

var answers = [
  ['а', 'a'],
  ['и', 'i'],
  ['у', 'u'],
  ['э', 'e', 'е'],
  ['о', 'o'],
  ['ка', 'ka'],
  ['ки', 'ki'],
  ['ку', 'ku'],
  ['кэ', 'ke', 'ке'],
  ['ко', 'ko'],
  ['са', 'sa'],
  ['си', 'shi', 'si'],
  ['су', 'su'],
  ['сэ', 'se', 'се'],
  ['со', 'so'],
  ['та', 'ta'],
  ['ти', 'chi'],
  ['цу', 'tsu'],
  ['тэ', 'te', 'те'],
  ['то', 'to'],
  ['на', 'na'],
  ['ни', 'ni'],
  ['ну', 'nu'],
  ['нэ', 'ne', 'не'],
  ['но', 'no'],
  ['ха', 'ha'],
  ['хи', 'hi'],
  ['фу', 'fu'],
  ['хэ', 'he', 'хе'],
  ['хо', 'ho'],
  ['ма', 'ma'],
  ['ми', 'mi'],
  ['му', 'mu'],
  ['мэ', 'me', 'ме'],
  ['мо', 'mo'],
  ['я', 'ya'],
  ['ю', 'yu'],
  ['ё', 'yo'],
  ['ра', 'ra'],
  ['ри', 'ri'],
  ['ру', 'ru'],
  ['рэ', 're', 'ре'],
  ['ро', 'ro'],
  ['ва', 'wa'],
  ['о', 'o', 'во', 'wo'],
  ['н', 'n']
];

var currentOrder = [];

var shuffleOrder = function (array) {
	var shuffable = array.slice();
  var shuffled = [];
	for (var i = 0; i < array.length; i++) {
		var randomElement = Math.floor(Math.random() * shuffable.length);
    shuffled.push(shuffable[randomElement]);
		shuffable.splice(randomElement, 1);
	}
  return shuffled;
};

var updateOrder = function (recipient, donor) {
  for (var i = 0; i < recipient.length; i++) {
    donor.splice(donor.indexOf(recipient[i]), 1);
  }
  return donor.concat(recipient);
};

currentOrder = shuffleOrder(questions);

var newQuestion = function () {
  shitsumon.classList.remove('k' + kana); //delete last question
  shitsumon.classList.remove('right'); //delete from last question
  kotae.value = ''; //delete last answer
  kotae.removeAttribute('disabled');
  kotae.focus();
  kana = currentOrder[currentOrder.length - 1];
  shitsumon.classList.add('k' + kana); //load image
};
newQuestion(); //first launch

kotae.addEventListener('keyup', function (e) { // input
  if (e.keyCode === ENTER_KEY_CODE) {
    if (e.currentTarget.value.length !== 0) { // input not empty
      if (answers[kana - 1].indexOf(e.currentTarget.value) > -1) { // right answer
        e.currentTarget.classList.remove('wrong');
        e.currentTarget.setAttribute('disabled', 'true');
        if (falls === 0) {
          currentOrder.pop();
        }
        if (currentOrder.length < 5) { // avoid objectionable repeat
          currentOrder = updateOrder(currentOrder, shuffleOrder(questions));
        }
        falls = 0;
        score++;
        if (score < 20) { // continue
          shitsumon.classList.add('right'); // circle animation
          setTimeout(newQuestion, 400); // wait animation and new question
        } else { // win
          win();
        }
      } else { // wrong answer
        e.currentTarget.classList.add('wrong'); // input indication
        shitsumon.classList.add('wrong'); // disk animation
        setTimeout(function () { // to be ready for else one animation
          shitsumon.classList.remove('wrong');
        }, 700);
        if (falls === 0) { // repeat problem kana soon
          currentOrder.pop();
          currentOrder[currentOrder.length] = currentOrder[currentOrder.length - 3];
          currentOrder[currentOrder.length - 4] = kana;
        }
        score = 0;
        falls++;
      }
    }
    if (falls > 2) { // tip
      tip.classList.add('active');
    } else {
      tip.classList.remove('active');
    }
  }
});

kotae.addEventListener('input', function (e) {
  e.currentTarget.classList.remove('wrong');
});

var win = function () { // win
  winOverlay.classList.add('active');
  winPopup.classList.add('active');
  winPopup.querySelector('.again').addEventListener('click', trainAgain);
};

var trainAgain = function () {
  score = 0;
  winOverlay.classList.remove('active');
  winPopup.classList.remove('active');
  newQuestion();
  winPopup.querySelector('.again').removeEventListener('click', trainAgain);
};

rulesLink.addEventListener('click', function () { // rules
  rules.classList.toggle('active');
  rulesOverlay.classList.toggle('active');
  if (!rules.classList.contains('active')) {
    kotae.focus();
    document.removeEventListener('keydown', rulesEscHandler);
  } else {
    document.addEventListener('keydown', rulesEscHandler);
  }
});

var hideRules = function () {
  rules.classList.remove('active');
  rulesOverlay.classList.remove('active');
  document.removeEventListener('keydown', rulesEscHandler);
  kotae.focus();
};

var rulesEscHandler = function (e) {
  if (e.keyCode == ESCAPE_KEY_CODE) {
    hideRules();
  }
};

rulesOverlay.addEventListener('click', hideRules);
rules.querySelector('.close').addEventListener('click', hideRules);

document.querySelector('.focus-overlay').addEventListener('click', function () { // avoid double-click
	kotae.focus();
});
