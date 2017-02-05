'use strict';
var $=jQuery;
jQuery(document).ready(function($){
	var kana = 45,
		currentKana = 46;
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

	var score = 0,
		order = [],
		falls = 0;

	var $kotae = $('.kotae'),
		$shitsumon = $('.shitsumon'),
		$tip = $('.tip');

	var $rules = $('.rules'),
		$rulesLink = $('.rules-link'),
		$rulesOverlay = $('.rules-overlay');

	var $win = $('.win'),
		$winOverlay = $('.win-overlay');

	var newQ = function() { //new question
		$shitsumon.removeClass('k' + String(kana)).removeClass('right'); //delete last question
		$kotae.val('').prop('disabled', false).focus(); //delete last answer
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
		$shitsumon.addClass('k' + String(kana)); //load image
	};
	newQ(); //first launch

	$kotae.on('keyup', function (e) { //input
		var $this = $(this);
		if (e.keyCode == 13) { //enter
			if ($this.val().length != 0) { //not empty
				if ($.inArray($this.val(), answer[kana]) != -1) { //right answer
					falls = 0;
					score += 1;
					$this.removeClass('wrong').prop('disabled', true);
					if (kana == order[0]) {
						order.shift();
					}
					if (score < 20) { //continue
						$shitsumon.addClass('right'); //animation
						setTimeout(newQ, 400); //wait animation and new question
					} else { //win
						win();
					}
				} else { //wrong answer
					score = 0;
					falls += 1;
					$this.addClass('wrong');
					$shitsumon.addClass('wrong'); //animation
					setTimeout(function () { //to be ready for else one animation
						$shitsumon.removeClass('wrong');
					}, 700);

					if (order[order.length - 1] != kana) { //wrong answer not in the order
						if (order.length < 5) { //add random, then problem
							var newOrder = Math.floor((Math.random() * 46));
							if ($.inArray(newOrder, order[kana]) != -1) {
								newOrder += 1;
								if (newOrder == 46) {
									newOrder = 0;
								}
							}
							order.push(newOrder);
						}
						if (order.length == 1) { //else one random
							var additonalOrder = Math.floor((Math.random() * 46));
							if ($.inArray(additonalOrder, order[kana]) != -1) {
								additonalOrder += 1;
								if (additonalOrder == kana) {
									additonalOrder += 1;
								}
								if (additonalOrder == 46) {
									additonalOrder = 0;
								}
							}
							order.push(additonalOrder);
						}
						order.push(kana);
					}
				}
			}

			if (falls > 2) { //tip
				$tip.addClass('active');
			} else {
				$tip.removeClass('active');
			}
		}
	}).on('input', function () {
		$(this).removeClass('wrong');
	});

	var win = function () { //win
		$winOverlay.addClass('active');
		$win.addClass('active');
	};

	$win.on('click', '.again', function () {
		score = 0;
		$winOverlay.removeClass('active');
		$win.removeClass('active');
		newQ();
	});

	$rulesLink.on('click', function () { //rules
		$rules.toggleClass('active');
		$rulesOverlay.toggleClass('active');
		if (!$rules.hasClass('active')) {
			$kotae.focus();
		}
	});

	$rulesOverlay.on('click', function () {
		$rules.removeClass('active');
		$(this).removeClass('active');
		$kotae.focus();
	});

	$rules.on('click', '.close', function () {
		$rules.removeClass('active');
		$rulesOverlay.removeClass('active');
		$kotae.focus();
	});

	$(document).on('keyup', function(e) { //esc
		if (e.keyCode == 27) {
			$rules.removeClass('active');
			$rulesOverlay.removeClass('active');
			$kotae.focus();
		}
	});

	$('.focus-overlay').on('click', function () { //stay focused
		$kotae.focus();
	});
});
