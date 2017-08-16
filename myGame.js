//POKER SLOT MACHINE
//draw five cards and see if you get LUCKY!

var readline = require('readline'); //module to read user input
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var logs = {
	introMsg:				'\x1b[32m' + //green 
							'##WELCOME TO NO BRAIN POKER SLOT MACHINE!##\n' +
							'\x1b[0m' + //reset
							'-Draw five cards and see if you get LUCKY!-\n' +
							'\x1b[0m' + //reset
							'********************\x1b[32mODDS\x1b[0m*******************\n' +
							'\x1b[37m' + //white
							'---------ROYAL FLUSH    1:100.000----------\n' +
							'------STRAIGHT FLUSH    1:10.000-----------\n' +
							'------FOUR OF A KIND    1:1.000------------\n' +
							'----------FULL HOUSE    1:100--------------\n' +
							'---------------FLUSH    1:50---------------\n' +
							'------------STRAIGHT    1:25---------------\n' +
							'-----THREE OF A KIND    1:10----------------\n' +
							'---------DOUBLE PAIR    1:4----------------\n' +
							'----------------PAIR    1:1----------------\n\x1b[0m' +
							'********************\x1b[32m\u2660\u2665\u2663\u2666\x1b[37m\x1b[0m*******************\n' +
							'\x1b[0m',//reset
	promptMoneyMsg: 		'************\x1b[32mPLEASE INSERT MONEY\x1b[0m************ \n$',
	promptRedrawMsg: 		'DO YOU WANT TO DRAW AGAIN? (y/n) ... ',
	notEnoughBalanceMsg: 	'SORRY, YOU DO NOT HAVE ENOUGH BALANCE ...\n' + 'EXITING ...',
	startingBalanceMsg: function(balance) {
		console.log('YOUR STARTING BALANCE: $' + balance);
	},
	drawMsg: function(balance) {
		console.log(
			'-------------------------\n' + 
			'Bet $1 from your balance. BALANCE: $' + balance + '\nDrawing cards ...'
		);
	},
	luckyMsg: function(result, prize, balance) {
		console.log( 
			'\n\x1b[5m\x1b[32m\x1b[1m' + result + '!!!\x1b[0m\n' +
			'YOU GOT: $' + prize + ' - BALANCE: $' + balance + '\n' +
			'-------------------------'
		);
	},												
	unluckyMsg: function(result, balance) {
		console.log(
			'\n\x1b[5m\x1b[31m\x1b[1m' + result + '!!!\x1b[0m\n' +
			'-------------------------'
		);
	},
	exitMsg: function(balance) {
		console.log(
			'\n************SEE YOU LATER**************\n' +
			'HERE IS YOUR $' + balance + '...\n' +
			'************SEE YOU LATER**************\n'
		);
	}
};

var prizes = {
	'ROYAL FLUSH': 100000,
	'STRAIGHT FLUSH': 10000,
	'FOUR OF A KIND': 1000,
	'FULL HOUSE': 100,
	'FLUSH': 50,
	'STRAIGHT': 25,
	'THREE OF A KIND': 10,
	'DOUBLE PAIR': 4,
	'PAIR': 1,
	'UNLUCKY': 0
}

var deckOfCards = {
	suits: ['\u2660', '\u2665', '\u2663', '\u2666'], //representation of [SPADE, HEART, CLUB, DIAMOND] in UTF-8 encoding. ISSUE: compatibility with windows (or non UTF-8) terminal?
	ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'], //array of 13 card ranks
	drawCard: function() {
		var randomizeRank = Math.floor(Math.random() * 13); //generate random number 0-12 to access array of 'ranks'
		var randomizeSuit = Math.floor(Math.random() * 4); //generate random number 0-3 to access array of 'suits'

		var randomValue = randomizeRank + '-' + randomizeSuit; //store card value (ranks 0-12, suits 0-3)
		var randomCard = this.ranks[randomizeRank] + ' ' + this.suits[randomizeSuit]; //access aray, generate, and store card

		return [randomCard, randomValue]; //return an array of random card (index 0) and it's value (index 1).
	},
	drawFiveCards: function() {
		var drawn = []; //array variable to store cards
		var drawnCardsTemp = []; //temporary array to store drawn cards (cards only without its value)
		while (drawn.length < 5) { //keep drawing until 'drawn' have 5 cards.

			drawnCardAndValue = this.drawCard(); //call 'drawCard' function to draw single card and its value, then store it

			if (drawnCardsTemp.indexOf(drawnCardAndValue[0]) === -1) { //check if the card drawn already present in the 'drawn'-so don't draw the same card
				drawnCardsTemp.push(drawnCardAndValue[0]);
				drawn.push(drawnCardAndValue); //insert the drawn card and its value (array) in 'drawn';
			} 
		}
		return drawn; //array of arrays
	}
}

//for testing evaluateCards function 
//PAIR var cardsAndValue = [ [ '9 ♠', '7-0' ], [ 'Q ♠', '10-0' ], [ '3 ♥', '1-1' ], [ '7 ♥', '5-1' ], [ '9 ♥', '7-1' ] ];
//DOUBLE PAIR var cardsAndValue = [ [ 'K ♥', '11-1' ], [ 'K ♣', '11-2' ], [ '10 ♥', '8-1' ], [ '10 ♣', '8-2' ], [ '7 ♣', '5-2' ] ];
//FULL HOUSE var cardsAndValue = [ [ '9 ♠', '7-0' ], [ 'J ♠', '9-0' ], [ 'J ♦', '9-3' ], [ 'J ♠', '9-0' ], [ '9 ♥', '7-1' ] ];
//THREE OF A KIND var cardsAndValue = [ [ '5 ♦', '3-3' ], [ 'J ♠', '9-0' ], [ '7 ♦', '5-3' ], [ 'J ♦', '9-3' ], [ 'J ♦', '9-3' ] ];
//STRAIGHT var cardsAndValue = [ [ '9 ♥', '7-1' ], [ '10 ♣', '8-2' ], [ 'J ♥', '9-1' ], [ 'Q ♣', '10-2' ], [ 'K ♣', '11-2' ] ];
//ROYAL STRAIGHT var cardsAndValue = [ [ '10 ♦', '8-3' ], [ 'J ♠', '9-0' ], [ 'Q ♦', '10-3' ], [ 'K ♦', '11-3' ], [ 'A ♦', '12-3' ] ];

function evaluateCards(cardsAndValue) {
	var rankCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var suitCounts = [0, 0, 0, 0];

	var flush = 0;
	var straight = 0;
	var pair = 0;
	var threeOfAKind = 0;
	var fourOfAKind = 0;

	var result = '';

	var cardsValue = cardsAndValue
						.reduce((arr, val) => arr.concat(val[1]), [])
						.map( val => {
							val = val.split('-');
							val[0] = parseInt(val[0]); //rank index
							val[1] = parseInt(val[1]); //suits index
							rankCounts[val[0]]++;
							suitCounts[val[1]]++;
						});

	//look for flush
	function isFlush() {
		if (suitCounts.indexOf(5) >= 0) {
			return 1
		}
		return 0; 
	}

	//look for straight
	function isStraight() {
		var count = 0;

		//straight in a five cards sequence requires no card rank appears more than once
		if (rankCounts.indexOf(2) >= 0 || rankCounts.indexOf(3) >= 0 || rankCounts.indexOf(4) >= 0 || rankCounts.indexOf(5) >= 0) {
			return 0;
		}

		for (var i = 0; i < 13; i++) {
			if (rankCounts[i] === 1) {
				count++;
			} else if (rankCounts[i] === 0 && count === 5) {
				return 1;
			} else if (rankCounts[i] === 0 && count !== 0 && count < 5) {
				return 0;
			}
		}

		return 2; //if this function doesn't exit on foremost for loop, means it's a royal straight (10 J Q K A);
	}

	//look for pairs and kinds
	(function countPairsAndKinds() {
		for (var i = 0; i < 13; i++) {
			if (rankCounts[i] === 2) {
				pair++;
			} else if (rankCounts[i] === 3) {
				threeOfAKind++;
			} else if (rankCounts[i] === 4) {
				fourOfAKind++;
			}
		}
	})();

	flush = isFlush();
	straight = isStraight();

	if (flush === 1 && straight === 2) {
			result += 'ROYAL FLUSH';
		} else if (flush === 1 && straight === 1) {
			result += 'STRAIGHT FLUSH';
		} else if (fourOfAKind === 1) {
			result += 'FOUR OF A KIND';
		} else if (threeOfAKind === 1 && pair === 1) {
			result += 'FULL HOUSE';
		} else if (flush === 1) {
			result += "FLUSH";
		} else if (straight > 0) {
			result += "STRAIGHT";
		} else if (threeOfAKind === 1) {
			result += "THREE OF A KIND";
		} else if (pair === 2) {
			result += "DOUBLE PAIR";
		} else if (pair === 1) {
			result += "PAIR";
		} else {
			result += "UNLUCKY";
		}

	return result; //FOR TEST [flush, straight, pair, threeOfAKind, fourOfAKind, result];
}

function addStartingBalance() {
	rl.question(logs.promptMoneyMsg, function(inputBalance) {
		if (inputBalance > 0) {
			balance = parseInt(inputBalance);
			logs.startingBalanceMsg(balance);
			serveCards();
		} else {
			addStartingBalance();
		}
	});
}

function promptDrawAgain() {
	rl.question(logs.promptRedrawMsg, function(answer){
		if (answer === 'y') {
			if (balance < 1) {
				console.log(logs.notEnoughBalanceMsg);
				rl.close();
			} else {
				console.log('\033c'); //clear console
				console.log(logs.introMsg);
				serveCards();
			}
		} else if (answer === 'n') {
			logs.exitMsg(balance);
			rl.close();
		} else {
			promptDrawAgain();
		}
	});
}

function serveCards() {
	balance--;
	logs.drawMsg(balance);
	var currentCardsAndValue = deckOfCards.drawFiveCards();
	var currentCards = currentCardsAndValue.reduce((arr, val) => arr.concat(val[0]), []);
	var result = evaluateCards(currentCardsAndValue);
	var prize = prizes[result];
	balance += prize;

	function delayedDraw(index) {
		setTimeout(function() {
			process.stdout.write('\x1b[37m' + currentCards[index] + ' ');
		}, (i * 500) + 500);
	}
	for (var i = 0; i < 5; i++) {
		delayedDraw(i);
	}

	setTimeout(function() {
		displayResult(result, prize);
	}, 2600);
}

function displayResult(result, prize) {
	if (result !== 'UNLUCKY') {
		logs.luckyMsg(result, prize, balance);
	} else {
		logs.unluckyMsg(result, balance);
	}
	promptDrawAgain();
}



(function startGame() {
	var balance = 0;
	console.log(logs.introMsg);
	addStartingBalance();
})();