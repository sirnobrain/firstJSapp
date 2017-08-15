var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var introMessage = '\x1b[32m' + //green
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
					'----------------PAIR    1:1----------------\n' +
					'********************\x1b[32m\u2660\u2665\u2663\u2666\x1b[37m*******************\n' +
					'\x1b[0m';//reset

var deckOfCards = {
	suits: ['\u2660', '\u2665', '\u2663', '\u2666'], //SPADE, HEART, CLUB, DIAMOND
	ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
	getCard: function() {
		var randomizeRank = Math.floor(Math.random() * 13);
		var randomizeSuit = Math.floor(Math.random() * 4);
		return this.ranks[randomizeRank] + ' ' + this.suits[randomizeSuit];
	}
}

var credits = 0;

function promptMoney() {
	rl.question('************\x1b[32mPLEASE INSERT MONEY\x1b[0m************ \n$', function(money){
		if (money > 0) {
			credits = parseInt(money);
			console.log('YOUR STARTING CREDITS: $' + credits + '\n');
			gameStart(promptRedraw);
		} else {
			promptMoney();
		}
	});
}

function promptRedraw() {
	rl.question('DO YOU WANT TO DRAW AGAIN? (y/n) ... ', function(answer){
		if (answer === 'y') {
			if (credits < 1) {
				console.log('SORRY, YOU DO NOT HAVE ENOUGH CREDIT ...');
				process.exit();
			} else {
				console.log('\033c');
				gameStart(promptRedraw);
			}
		} else if (answer === 'n') {
			console.log('\n************SEE YOU LATER**************');
			console.log('HERE IS YOUR $' + credits + '...');
			console.log('************SEE YOU LATER**************');
			rl.close();
		} else {
			promptRedraw();
		}
	});
}

function drawFive() {
	var drawn = [];

	while (drawn.length < 5) {
		drawnCard = deckOfCards.getCard();
		if (drawn.indexOf(drawnCard) === -1) {
			drawn.push(drawnCard);
		} 
	}
	return drawn;
}

function evalRank(rank) {
	switch (rank) {
		case '2':
			return 0;
		case '3':
			return 1;
		case '4':
			return 2;
		case '5':
			return 3;
		case '6':
			return 4;
		case '7':
			return 5;
		case '8':
			return 6;
		case '9':
			return 7;
		case '10':
			return 8;
		case 'J':
			return 9;
		case 'Q':
			return 10;
		case 'K':
			return 11;
		case 'A':
			return 12;
	}
}

function evalSuit(suit) {
	switch (suit) {
		case '\u2660':
			return 0;
		case '\u2665':
			return 1;
		case '\u2663':
			return 2;
		case '\u2666':
			return 3;
	}
}

function evalFlush(suitCounts) {
	if (suitCounts.indexOf(5) >= 0) { return 1; }
	return 0;
}

function evalFourOfAKind(rankCounts) {
	if (rankCounts.indexOf(4) >= 0) { return 1; }
	return 0;
}

function evalThreeOfAKind(rankCounts) {
	if (rankCounts.indexOf(3) >= 0) { return 1; }
	return 0;
}

function evalNumOfPair(rankCounts) {
	var pairCount = 0;
	for (var i = 0; i < 13; i++) {
		if (rankCounts[i] === 2) {
			pairCount += 1;
		}
	}
	return pairCount;
}

function evalRoyalStraight(rankCounts) {
	for (var i = 8; i < 13; i++) {
		if (rankCounts[i] !== 1) {
			return 0;
		}
	}
	return 1;
}

function evalStraight(rankCounts) {
	var count = 0;

	if (rankCounts.indexOf(2) > 0 || rankCounts.indexOf(3) > 0 || rankCounts.indexOf(4) > 0 || rankCounts.indexOf(5) > 0) {
		return 0;
	}

	for (var i = 0; i < 13; i++) {
		if (rankCounts[i] === 1) {
			count += 1;
		} else if (rankCounts[i] === 0 && count === 5) {
			return 1;
		} else if (rankCounts[i] === 0 && count < 5 && count !== 0) {
			return 0;
		}
	}
	return 1;
}

function evaluate(cards) {
	var rankCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var suitCounts = [0, 0, 0, 0];
	var result = '';
	var flush, straight, fourOfAKind, threeOfAKind, pair;

	cards.map(function(card){
		card = card.split(' ');
		rankIndex = evalRank(card[0]);
		suitIndex = evalSuit(card[1]);
		rankCounts[rankIndex] += 1;
		suitCounts[suitIndex] += 1;
	});

	flush = evalFlush(suitCounts);
	fourOfAKind = evalFourOfAKind(rankCounts);
	threeOfAKind = evalThreeOfAKind(rankCounts);
	pair = evalNumOfPair(rankCounts);
	straight = evalStraight(rankCounts) === 1 ? evalRoyalStraight(rankCounts) + 1 : 0; //0 for no straight, 1 for straight, 2 for royal straight

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
	} else if (straight === 1) {
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

function determinePrizes(result) {
	switch (result) {
		case 'ROYAL FLUSH':
			return 100000;
		case 'STRAIGHT FLUSH':
			return 10000;
		case 'FOUR OF A KIND':
			return 1000;
		case 'FULL HOUSE':
			return 100;
		case 'FLUSH':
			return 50;
		case 'STRAIGHT':
			return 25;
		case 'THREE OF A KIND':
			return 10;
		case 'DOUBLE PAIR':
			return 4;
		case 'PAIR':
			return 1;
	}
}

function gameStart(next) {
	credits -= 1;
	console.log('-------------------------');
	console.log('Bet $1 from your credits. CREDITS: $' + credits + '\nDrawing cards ...');
	var myCards = drawFive();
	var result = evaluate(myCards);

	function drawWithTimeout(i) {
		setTimeout(function(){
			process.stdout.write('\x1b[37m' + myCards[i] + ' ');
		}, i * 600);
	}

	for (var i = 0; i < 5; i++) {
		drawWithTimeout(i);
	}

	if (result !== 'UNLUCKY') {
		var prizes = determinePrizes(result);
		credits += prizes;
		setTimeout(function(){
			console.log('\n\x1b[5m\x1b[32m\x1b[1m' + result + '!!!\x1b[0m');
			console.log('YOU GOT: $' + prizes + ' - CREDITS: $' + credits);
			console.log('-------------------------');
		}, 3000);
	} else {
		setTimeout(function(){
			console.log('\n\x1b[5m\x1b[31m\x1b[1m' + result + '!!!\x1b[0m');
			console.log('CREDITS: $' + credits);
			console.log('-------------------------');
		}, 3000);
	}

	setTimeout(function() {
		next();
	}, 3500);
}

console.log(introMessage);
promptMoney();