'use strict';

var kana = 45;
var currentKana = 46;

var answer = [
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

var score = 0;
var order = [];
var falls = 0;

var kotae = document.querySelector('.kotae');
var shitsumon = document.querySelector('.shitsumon');
var tip = document.querySelector('.tip');

var rules = document.querySelector('.rules');
var rulesLink = document.querySelector('.rules-link');
var rulesOverlay = document.querySelector('.rules-overlay');

var winPopup = document.querySelector('.win');
var winOverlay = document.querySelector('.win-overlay');

var newQ = function () { //new question
	shitsumon.classList.remove('k' + String(kana)); //delete last question
	shitsumon.classList.remove('right'); //delete last question
	kotae.value = ''; //delete last answer
	kotae.removeAttribute('disabled');
	kotae.focus();
	if (order != 0) { //ordered question
		kana = order[0];
	} else { //random question
		kana = Math.floor((Math.random() * 46));
		if (kana == currentKana) { //but not previous
			kana = kana + 1;
			if (kana == 46) {
				kana = 0;
			}
		}
	}
	currentKana = kana;
	shitsumon.classList.add('k' + String(kana)); //load image
};
newQ(); //first launch

kotae.addEventListener('keyup', function (e) { //input
	var $this = kotae;
	if (e.keyCode == 13) { //enter
		if ($this.value.length != 0) { //not empty
			if (answer[kana].indexOf($this.value) > -1) { //right answer
				falls = 0;
				score += 1;
				$this.classList.remove('wrong');
				$this.setAttribute('disabled', 'true');
				if (kana == order[0]) {
					order.shift();
				}
				if (score < 20) { //continue
					shitsumon.classList.add('right'); //animation
					setTimeout(newQ, 400); //wait animation and new question
				} else { //win
					win();
				}
			} else { //wrong answer
				score = 0;
				falls += 1;
				$this.classList.add('wrong');
				shitsumon.classList.add('wrong'); //animation
				setTimeout(function () { //to be ready for else one animation
					shitsumon.classList.remove('wrong');
				}, 700);

				if (order[order.length - 1] != kana) { //wrong answer not in the order
					if (order.length < 5) { //add random, then problem
						var newOrder = Math.floor((Math.random() * 46));
						if (order.indexOf(newOrder) > -1) {
							newOrder += 1;
							if (newOrder == 46) {
								newOrder = 0;
							}
						}
						order.push(newOrder);
					}
					if (order.length == 1) { //else one random
						var additionalOrder = Math.floor((Math.random() * 46));
						if (order.indexOf(newOrder) > -1) {
							additionalOrder += 1;
							if (additionalOrder == kana) {
								additionalOrder += 1;
							}
							if (additionalOrder == 46) {
								additionalOrder = 0;
							}
						}
						order.push(additionalOrder);
					}
					order.push(kana);
				}
			}
		}

		if (falls > 2) { //tip
			tip.classList.add('active');
		} else {
			tip.classList.remove('active');
		}
	}
});
kotae.addEventListener('input', function (e) {
	e.currentTarget.classList.remove('wrong');
});

var win = function () { //win
	winOverlay.classList.add('active');
	winPopup.classList.add('active');
};

winPopup.querySelector('.again').addEventListener('click', function () {
	score = 0;
	winOverlay.classList.remove('active');
	winPopup.classList.remove('active');
	newQ();
});

rulesLink.addEventListener('click', function () { // rules
	rules.classList.toggle('active');
	rulesOverlay.classList.toggle('active');
	if (!rules.hasClass('active')) {
		kotae.focus();
	}
});

rulesOverlay.addEventListener('click', function () {
	rules.classList.remove('active');
	rulesOverlay.classList.remove('active');
	kotae.focus();
});

rules.querySelector('.close').addEventListener('click', function () {
	rules.classList.remove('active');
	rulesOverlay.classList.remove('active');
	kotae.focus();
});

document.addEventListener('keyup', function(e) { // esc
	if (e.keyCode == 27) {
		rules.classList.remove('active');
		rulesOverlay.classList.remove('active');
		kotae.focus();
	}
});

document.querySelector('.focus-overlay').addEventListener('click', function () { // avoid double-click
	kotae.focus();
});
