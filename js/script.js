'use strict';

var kana = 0;
var score = 0;
var falls = 0;

var ENTER_KEY_CODE = 13;
var ESCAPE_KEY_CODE = 27;

var kotae;
var shitsumon;
var tip;
var dakuten;
var rules;
var rulesLink;
var rulesOverlay;
var winPopup;
var winOverlay;
var focusOverlay;

var ANSWERS = [
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

var ADDITIONAL_ANSWERS = [
  ['га', 'ga'],
  ['ги', 'gi'],
  ['гу', 'gu'],
  ['гэ', 'ge', 'ге'],
  ['го', 'go'],
  ['дза', 'za', 'за', 'dza'],
  ['дзи', 'ji', 'зи', 'джи', 'zi', 'dzi', 'dji'],
  ['дзу', 'zu', 'зу', 'dzu'],
  ['дзэ', 'ze', 'зэ', 'дзе', 'зе', 'dze'],
  ['дзо', 'zo', 'зо', 'dzo'],
  ['да', 'da'],
  ['дзи', 'ji', 'ди', 'джи', 'di', 'dzi', 'dji'],
  ['дзу', 'zu', 'ду', 'dzu', 'du'],
  ['дэ', 'de', 'де'],
  ['до', 'do'],
  ['ба', 'ba'],
  ['би', 'bi'],
  ['бу', 'bu'],
  ['бэ', 'be', 'бе'],
  ['бо', 'bo'],
  ['па', 'pa'],
  ['пи', 'pi'],
  ['пу', 'pu'],
  ['пэ', 'pe', 'пе'],
  ['по', 'po']
];

var answers;
var questions;
var currentOrder;

function countQuestions () {
  questions = [];
  for (var i = 0; i < answers.length; i++) {
    questions.push(i + 1);
  }
}

function shuffleQuestions () {
  currentOrder = shuffleOrder(questions);
}

function shuffleOrder (array) {
  var shuffable = array.slice();
  var shuffled = [];
  for (var i = 0; i < array.length; i++) {
    var randomElement = Math.floor(Math.random() * shuffable.length);
    shuffled.push(shuffable[randomElement]);
    shuffable.splice(randomElement, 1);
  }
  return shuffled;
}

function updateOrder (recipient, donor) {
  for (var i = 0; i < recipient.length; i++) {
    donor.splice(donor.indexOf(recipient[i]), 1);
  }
  return donor.concat(recipient);
}

function newQuestion () {
  shitsumon.classList.remove('k' + kana); // delete last question
  shitsumon.classList.remove('right'); // delete from last question
  kotae.value = ''; // delete last answer
  kotae.removeAttribute('disabled');
  kotae.focus();
  kana = currentOrder[currentOrder.length - 1];
  shitsumon.classList.add('k' + kana); // load image
}

function ready() {
  kotae = document.querySelector('.kotae');
  shitsumon = document.querySelector('.shitsumon');
  tip = document.querySelector('.tip');
  dakuten = document.querySelector('.dakuten');
  rules = document.querySelector('.rules');
  rulesLink = document.querySelector('.rules-link');
  rulesOverlay = document.querySelector('.rules-overlay');
  winPopup = document.querySelector('.win');
  winOverlay = document.querySelector('.win-overlay');
  focusOverlay = document.querySelector('.focus-overlay');

  answers = ANSWERS;
  currentOrder = [];

  countQuestions();
  shuffleQuestions();
  newQuestion(); // first launch

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

  rulesOverlay.addEventListener('click', hideRules);
  rules.querySelector('.close').addEventListener('click', hideRules);

  focusOverlay.addEventListener('click', function () { // avoid double-click
    kotae.focus();
  });

  dakuten.addEventListener('click', function () {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
      answers = ANSWERS.concat(ADDITIONAL_ANSWERS);
    } else {
      answers = ANSWERS;
    }
    countQuestions();
    currentOrder = shuffleOrder(questions);
    kotae.focus();
    if (kana > answers.length) {
      newQuestion();
    }
  });
}
document.addEventListener('DOMContentLoaded', ready);

function win () { // win
  winOverlay.classList.add('active');
  winPopup.classList.add('active');
  winPopup.querySelector('.again').addEventListener('click', trainAgain);
}

function trainAgain () {
  score = 0;
  winOverlay.classList.remove('active');
  winPopup.classList.remove('active');
  newQuestion();
  winPopup.querySelector('.again').removeEventListener('click', trainAgain);
}

function hideRules () {
  rules.classList.remove('active');
  rulesOverlay.classList.remove('active');
  document.removeEventListener('keydown', rulesEscHandler);
  kotae.focus();
}

function rulesEscHandler (e) {
  if (e.keyCode === ESCAPE_KEY_CODE) {
    hideRules();
  }
}
