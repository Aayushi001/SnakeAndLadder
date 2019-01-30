var Game = function (userCount) {
	var _this = this;
	var log = document.getElementById('log');
	userCount = parse(userCount);
	if (userCount < 2){
		printError("You need atleast 2 players to play the game.");
		printError("Reload page to restart the game");
		throw new Error("You need atleast 2 players to play the game.");
	}

	_this.board = [
		[1, 2, 3, 4, 25, 6, 7, 8, 9, 29],
		[11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		[21, 41, 23, 24, 25, 26, 27, 55, 29, 30],
		[14, 32, 33, 34, 35, 36, 17, 38, 39, 40],
		[41, 42, 43, 95, 45, 46, 47, 48, 49, 50],
		[51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
		[61, 62, 63, 64, 65, 66, 67, 68, 69, 89],
		[71, 72, 53, 74, 75, 76, 77, 39, 81, 80],
		[81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
		[91, 35, 93, 94, 95, 96, 97, 98, 7, 100]
	];


	function initNewBoard(){
		_this.board = [];
		for (var i = 0; i < 10; i++) {
			var row = [];
			for (var j = 1; j <= 10; j++) {
				row.push(i*10 + j);
			}
			_this.board.push(row);
		}
		
		var needsSnakes = prompt("Do you want to add snakes to your board? (yes/no)");
		while(needsSnakes.toLowerCase() === "yes"){
			try{
				var startBox = prompt("Enter the number at which the snake shall eat the player. ( 1 - 100 )");
			startBox = parse(startBox);
			if (!(startBox > 0 && startBox < 100))
				throw new Error("Input not in the said range.");

			var endBox = prompt("Enter the number at which the snake shall send the player. ( 1 - 100 )");
			endBox = parse(endBox);
			if (!(endBox > 0 && endBox < 100))
				throw new Error("Input not in the said range.");

			if (endBox > startBox)
				throw new Error("Snake cannot promote a player. End value should be lesser than the start value.");
			

			var row = startBox%10 === 0 ? startBox/10 - 1 : parse(startBox/10);
			var col = startBox%10 -1;
			if (col === -1)
				col = 9;

			console.log(row);
			console.log(col);
			_this.board[row][col] = endBox;		

		

			}
			catch(e){
				printError(e);
			}
			finally{
				needsSnakes = prompt("Do you want to add any more snakes to your board? (yes/no)");
			}

		}


		var needsLadders = prompt("Do you want to add ladder to your board? (yes/no)");
		while(needsLadders.toLowerCase() === "yes"){
			try{
				var startBox = prompt("Enter the number at which the ladder shall eat the player. ( 1 - 100 )");
			startBox = parse(startBox);
			if (!(startBox > 0 && startBox < 100))
				throw new Error("Input not in the said range.");

			var endBox = prompt("Enter the number at which the ladder shall send the player. ( 1 - 100 )");
			endBox = parse(endBox);
			if (!(endBox > 0 && endBox < 100))
				throw new Error("Input not in the said range.");

			if (endBox < startBox)
				throw new Error("Ladder cannot demote a player. End value should be greater than the start value.");
			

			var row = startBox%10 === 0 ? startBox/10 - 1 : parse(startBox/10);
			var col = startBox%10 -1;
			if (col === -1)
				col = 9;

			console.log(row);
			console.log(col);
			_this.board[row][col] = endBox;		

		

			}
			catch(e){
				printError(e);
			}
			finally{
				needsLadders = prompt("Do you want to add any more ladders to your board? (yes/no)");
			}

		}


	}

	function parse(val){
		if(isNaN(parseInt(userCount))){
			printError("Input should be an Integer Number");
			printError("Reload page to restart the game");
			throw new Error("Input should be an Integer Number");
		}
		return parseInt(val);
	}

	function printBoard(){
		var container = document.getElementById("board");
		console.log(container);
		for (var i = 0; i < 10; i++) {
			for (var j = 1; j <= 10; j++) {
				if(_this.board[i][j - 1] < (i*10 + j)){
					container.innerHTML += "<span>S -> "+_this.board[i][j-1]+"</span>" 
				}
				else if(_this.board[i][j - 1] > (i*10 + j)){
					container.innerHTML += "<span>L -> "+_this.board[i][j-1]+"</span>" 	
				}
				else {
					container.innerHTML += "<span>"+_this.board[i][j-1]+"</span>" 
				}
			}
			container.innerHTML += "</br></br>" 
		}
	}

	function printLog(text){
		log.innerHTML += "<p>"+text+"</p>"
	}

	function rollDice(){
		return parseInt(Math.random() * 6 + 1);
	}

	function declareWinner(player){
		printLog("<b>" + player + " has won</b>");
	}

	function printError(error){
		var container = document.getElementById("errors");
		container.innerHTML += "<p>"+error+"</p>"
	}

	return {
		run: function(){
			var initBoard = prompt("Do you want to build a new board? Selecting no would switch to the default board. (yes/no)");
			if (initBoard.toLowerCase() === "yes")
				initNewBoard();
			printBoard();
			printLog("The game has started with " + userCount + " players.");
			var users = new Array(userCount), positions = new Array(userCount);
			for (var i = 0; i < users.length; i++){
				users[i] = "Player " + (i + 1);
				positions[i] = rollDice();
				printLog(users[i] + " rolls dice scoring " + positions[i]);

			}

			for (var i = 0; i < users.length; i++){
				for (var j = i+1; j < users.length; j++){
					if(positions[i] < positions[j]){
						var temp = positions[i], temp2 = users[i];
						positions[i] = positions[j];
						users[i] = users[j];
						positions[j] = temp;
						users[j] = temp2;
					}
				}
				positions[i] = 0; // resetting the position to 0 to begin the game
			}

			printLog(users[0] + " gets to start");

			var interval = window.setInterval(function(){
				for(var i = 0; i < users.length; i++){
					var lastRoll, rollCounter = 0, totalRoll = 0;
					do{
						lastRoll = rollDice();
						printLog(users[i] + " has rolled " + lastRoll);
						totalRoll += lastRoll;
						rollCounter++;
					}
					while(lastRoll === 6 && rollCounter < 3);

					if (totalRoll === 18){
						printLog(users[i] + " skips turn for rolling 3 6(s)");
						continue;
					}

					if ((positions[i] + totalRoll) <= 100){
						printLog(users[i] + " moves from " + positions[i] + " to " + (positions[i] + totalRoll));
						positions[i] += totalRoll;
						if(positions[i] === 100){
							window.clearInterval(interval);
							declareWinner(users[i]);
							break;
						}
					}
					else{
						printLog(users[i] + " cannot move for this dice roll");
						continue;
					}

					var row = positions[i]%10 === 0 ? positions[i]/10 -1 : parse(positions[i]/10);
					var col = positions[i]%10 -1;
					if (col === -1)
						col = 9;

					if (_this.board[row][col] < positions[i]){
						positions[i] = _this.board[row][col];
						printLog("<b>Oops! " + users[i] + " has been bitten by snake and is now demoted to " + positions[i] + "</b>");
					}
					else if (_this.board[row][col] > positions[i]){
						positions[i] = _this.board[row][col];
						printLog("<b>Hurray! " + users[i] + " has climbed the ladder and is now promoted to " + positions[i] + "</b>");
					}




				}
			}, 500);




		}
	}

}

var userCount = prompt("Enter the number of users playing the game");

var game = new Game(userCount);
game.run();