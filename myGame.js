//SIMPLE POKER SLOT MACHINE GAME
//draw five cards and see if you get LUCKY!
//by Bambang Kurniawan (bembkurniawan@gmail.com)
//
//Submitted for Hacktiv8 Phase-0 Week 2 - Weekly Project

//module to read user input and write to console
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//object to determine prize
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
};
//object of cards
var deckOfCards = {
	suits: ['\u2660', '\x1b[31m\u2665', '\u2663', '\x1b[31m\u2666'],
	ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']	
};
//object to store user's balance and card values while playing
var userInfo = {
	balance: 0,
	cardsValue: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0]], //[ranks, suits]
	addBalance: function(value) {
		this.balance += value;
	},
	substractBalance: function(value) {
		this.balance -= value;
	},
	addCardsValue: function(type, index, value) {
		if (type === 'ranks') {
			this.cardsValue[0][index] += value;
		} else if (type === 'suits') {
			this.cardsValue[1][index] += value;
		}
	},
	resetCardsValue: function() {
		this.cardsValue = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0]];
	}
};
//logs and logs and logs, for easier editing let's make them an object!
var logs = {
	green: '\x1b[32m',
	black: "\x1b[30m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	blink: "\x1b[5m",
	reset: "\x1b[0m",
	bright: "\x1b[1m",

	introMsg: function() {
		console.log(
			'  ' + this.green + 'WELCOME TO NO BRAIN POKER SLOT MACHINE!' + '  \n' +
			' ' + this.white  + 'Draw five cards and see if you get LUCKY!' + ' \n' +
			this.green + '**************  ' + this.white + this.bright + 'TODAY\'S ODDS' + this.reset + this.green + '  *************\n' +
			'---------' + this.white + 'ROYAL FLUSH    1:100.000' + this.green + '----------\n' +
			'------' + this.white + 'STRAIGHT FLUSH    1:10.000' + this.green + '-----------\n' +
			'------' + this.white + 'FOUR OF A KIND    1:1.000' + this.green + '------------\n' +
			'----------' + this.white + 'FULL HOUSE    1:100' + this.green + '--------------\n' +
			'---------------' + this.white + 'FLUSH    1:50' + this.green + '---------------\n' +
			'------------' + this.white + 'STRAIGHT    1:25' + this.green + '---------------\n' +
			'-----' + this.white + 'THREE OF A KIND    1:10' + this.green + '---------------\n' +
			'---------' + this.white + 'DOUBLE PAIR    1:4' + this.green + '----------------\n' +
			'----------------' + this.white + 'PAIR    1:1' + this.green + '----------------\n' +
			'********************' + this.white + '\u2660\u2665\u2663\u2666' + this.green + '*******************\n' + this.reset
		);
	},
	initialBalance: function(balance) {
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log(
					this.white + this.bright + 'YOUR BALANCE: ' + this.green + '$' + balance + this.reset +
					this.white + '\n----------------------------------' + this.reset
				);
				resolve();
			}, 200);
		});
	},
	drawMsg: function(balance) {
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log(
					this.white + 'Substract ' + this.red + '$1' + this.white + ' from your balance.' +
					'\nCurent Balance: ' + this.green + this.bright + '$' + balance + this.reset
				);
			}, 500);
			setTimeout(() => {
				console.log(this.magenta + 'Drawing ...' + this.reset);
				resolve();
			}, 1300);
		});	
	},
	drawResult: function(result) {
		return new Promise((resolve) => {
			setTimeout(() => {
				if (result === 'UNLUCKY') {
					console.log(this.red + this.bright + this.blink + result + '!!!\n' + this.reset);
				} else {
					console.log(this.green + this.bright + this.blink + result + '!!!\n' + this.reset);
				}
				resolve();
			}, 300);
		});
	},
	prize: function(prize, balance) {
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log(
					this.white + this.bright + 'YOU GOT: ' + this.green + '$' + prize + 
					this.reset + 
					this.white + this.bright + ' - CURENT BALANCE: ' + this.green + '$' + balance +
					this.reset +
					this.white + '\n----------------------------------' + this.reset
				);
				resolve();
			}, 600);
		});
	},
	clearConsole: function() {
		return new Promise((resolve) => {
			setTimeout(() => {
				process.stdout.write('\033c'); //clear console
				resolve();
			}, 200);
		});
	},
	notEnoughBalanceMsg: function() {
		console.log(
			this.white + '----------------------------------' +
			this.bright + this.red + '\nYOU DO NOT HAVE ENOUGH BALANCE.' + this.white +'\nAUTO EXIT ...' + this.reset
		);
	},
	returnBalance: function(balance) {
		console.log(
			this.white + '----------------------------------' +
			this.bright + '\nHERE IS YOUR ' + this.green + '$' + balance + this.reset
		);
	},
	exitMsg: function() {
		console.log(
			this.green +
			'\n*******************************************' +
			'\n-----------' + this.white + this.bright + this.blink + 'THANK YOU FOR PLAYING' + this.reset + this.green + '-----------' +
			'\n--------------' + this.white + this.bright + this.blink + 'SEE YOU LATER!!' + this.reset + this.green + '--------------' +
			'\n*******************************************' + this.reset
		);
	}
};
//Ask user for money and add it to balance
function promptBalance() {
	return new Promise((resolve) => {
		var ask = () => {
			rl.question('\x1b[37m\x1b[1mINSERT MONEY\n\x1b[32m$', (inputBalance) => {
				var balance = parseInt(inputBalance);
				if (inputBalance > 0) {
					resolve(balance);
				} else {
					ask();
				}
			});
		}
		ask();
	});
}
//draw one card and store its value in userInfo object
function drawCard() {
	return new Promise((resolve) => {
		setTimeout(() => {
			var randomRank = Math.floor(Math.random() * 13);
			var randomSuit = Math.floor(Math.random() * 4);
			var card = deckOfCards.ranks[randomRank] + ' ' + deckOfCards.suits[randomSuit];
			var cardAndValue = [card, randomRank, randomSuit]; //array of [card, card's rank, card's suit]

			resolve(cardAndValue);

		}, 500);
	});
}
//draw five cards, calling drawCard() inside and display it one by one
async function drawFiveCards() {
	var cards = [];
	process.stdout.write('\n') //prints new line before displaying cards sequence;
	while (cards.length < 5) {
		var cardAndValue = await drawCard(); //will return array of [card, card's rank, card's suit]
		var card = cardAndValue[0];
		if (cards.indexOf(card) === -1) {
			process.stdout.write('\x1b[47m\x1b[30m ' + card + ' \x1b[0m ');
			cards.push(card);
			userInfo.addCardsValue('ranks', cardAndValue[1], 1);
			userInfo.addCardsValue('suits', cardAndValue[2], 1);
		}
	}
	process.stdout.write('\n') //prints new line after displaying cards sequence;
}
//evaluate cards sequence, return the result based on poker rules.
async function evaluateCards(cardsValue) {
	var ranksValue = cardsValue[0];
	var suitsValue = cardsValue[1];

	var flush = 0;
	var straight = 0;
	var pair = 0;
	var threeOfAKind = 0;
	var fourOfAKind = 0;
	var result = '';
	//look for flush
	function isFlush() {
		if (suitsValue.indexOf(5) >= 0) {
			return 1
		}
		return 0; 
	}
	//look for straight
	function isStraight() {
		var count = 0;

		//straight in a five cards sequence requires no card rank appears more than once
		if (ranksValue.indexOf(2) >= 0 || ranksValue.indexOf(3) >= 0 || ranksValue.indexOf(4) >= 0 || ranksValue.indexOf(5) >= 0) {
			return 0;
		}

		for (var i = 0; i < 13; i++) {
			if (ranksValue[i] === 1) {
				count++;
			} else if (ranksValue[i] === 0 && count === 5) {
				return 1;
			} else if (ranksValue[i] === 0 && count !== 0 && count < 5) {
				return 0;
			}
		}

		return 2; //if this function doesn't exit on foremost for loop, means it's a royal straight (10 J Q K A);
	}
	//look for pairs and kinds
	for (var i = 0; i < 13; i++) {
		if (ranksValue[i] === 2) {
			pair++;
		} else if (ranksValue[i] === 3) {
			threeOfAKind++;
		} else if (ranksValue[i] === 4) {
			fourOfAKind++;
		}
	}

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

	return result;
}

//ask user to redraw. answer will determine if cards should be served again or exit.
//although the answer is positive, exit automatically if user doesn't have enough balance.
function promptRedraw() {
	return new Promise((resolve) => {
		rl.question('\x1b[35mDraw Again? (y/n) ... \x1b[0m', (answer) => {
			if (answer === 'y' || answer === 'Y') {
				if (userInfo.balance < 1) {	//check user's balance and exit if user doesn't have any balance left
					logs.notEnoughBalanceMsg();
					logs.exitMsg();
					rl.close();
				} else {
					serveCards(); //otherwise, start serving another round!
				}
			} else if (answer === 'n' || answer === 'N') {
				logs.returnBalance(userInfo.balance);
				logs.exitMsg();
				rl.close(); //exit
			} else {
				promptRedraw(); //keep prompting if user doesn't give the right answer ('y' or 'n')
			}
		});
	});
}

//clear console, serve cards, display the results, display the prize, and calculate user's balance.
async function serveCards() {
	var result, prize;
	//initialization. clear console for a new round, logs intro massage, and logs user's remaining balance.
	await logs.clearConsole();
	logs.introMsg();
	await logs.initialBalance(userInfo.balance);
	//substract $1 from user balance (costs user $1 for each new round)
	userInfo.substractBalance(1);
	//reset card's values on user object.
	userInfo.resetCardsValue();
	//start drawing one by one.
	await logs.drawMsg(userInfo.balance);
	await drawFiveCards();
	//store result in 'result' variable, determine the prize and store it in 'prize'
	result = await evaluateCards(userInfo.cardsValue);
	prize = prizes[result];
	//add prize to user's balance
	userInfo.addBalance(prize);
	//logs result and prize to console.
	await logs.drawResult(result);
	await logs.prize(prize, userInfo.balance);
	//ask user to draw another round
	promptRedraw();
}

//GAME STARTS HERE
//self invoking function
(async function startGame() {
	//clear console for better playing experience xD
	await logs.clearConsole();
	//logs intro message
	logs.introMsg();
	//prompt user to insert money and add it to user's balance.
	userInfo.addBalance(await promptBalance());
	//start serving cards.
	serveCards();
})();