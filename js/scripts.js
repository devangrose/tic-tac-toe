// Global variables for game
var table = [];
var turn = 'x';
var winner = '';
var aiButton = document.getElementById('ai');


// Populates the table with the td elements from the document and adds listener for click
function populateTable(){
	var rows = document.getElementById('tictac').getElementsByTagName('tr');
	for(var i = 0; i < rows.length; i++){
		var columns = rows[i].children;
		var row = [];
		for(var j = 0; j < columns.length; j++){
			if(columns[j].tagName=='TD'){
				row.push(columns[j]);
				row[j].addEventListener("click",playerClicked);
				row[j].className=" ";
			}
		}

		table.push(row);
	}
	document.getElementById("reset").addEventListener("click",resetBoard);
}

// Executed when the player clicks, checks for win and changes turn
function playerClicked(){
	if(this.className == " "){
		this.className = turn;
		setTimeout(500);
		if(checkForWin(table,turn)){
			alert("Player " + turn.toUpperCase() + " won!");	
			win();
			resetBoard();
		}
        if(aiButton.checked){
            setTimeout(function(){},200);
            makeMove();
        }
        else {
            turn = switchTurn(turn);
        }
    }
}

// Switches player turns 
function switchTurn(currentTurn){
 return ((currentTurn ==='x') ? 'o' : 'x');
}

// Compares 3 tiles to see if they are all the same
function compareTiles(tile1, tile2, tile3,player){
	if((tile1.className == tile2.className && tile1.className == tile3.className) && tile1.className == player)
		return true;
	return false;
}


// Checks for 3 similar in a row 
function checkForWin(table, player) {
	// Check for horizontal/verticle wins
	for(var i = 0; i < 3; i++){
		if(compareTiles(table[i][0],table[i][1],table[i][2],player)){
            winner=table[i][0].classList.index(0);
			return true;
		}
		if(compareTiles(table[0][i], table[1][i], table[2][i],player)){
			return true;
		}
	}

	// Check for diagonal wins
	if(compareTiles(table[0][0], table[1][1], table[2][2], player)){
		return true;
	}
	else if (compareTiles(table[0][2],table[1][1],table[2][0],player)){
		return true;
	}

	checkTie(table);
	return false;
}

// Checking for tie 
function checkTie(table){
	var total = 0;
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			if(table[i][j].className != " ")
				total++;
		}
	}
	if(total == 9)
	{
		alert("It's a tie!");
		resetBoard();
	}
}


// Reset the board
function resetBoard(){
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			table[i][j].className = " ";
		}
	}
    turn = 'x';
}

function win(){
	var number = document.getElementById(turn).innerHTML;
	number = parseInt(number);
	number++;
	document.getElementById(turn).innerHTML = number;
}

populateTable();

    
//------------------ AI ------------------------------//
function getOptions(table){
    var open = [];
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            if(!table[i][j].classList.contains('x') && !table[i][j].classList.contains('o'))
                open.push(table[i][j]);
        }
    }
    return open;
}


function tableEvaluator(table, player){
    if(checkForWin(table,player)){
        return 1;
    }
    else if(checkTie(table)){
        return 0;
    }
    else if(checkForWin(table, switchTurn(player))) {
        return -1;
    }
    else {
        var options = getOptions(table);
        var copy = deepCopy(table);
        console.log(options);
        var possibleMoves = [];
        for(var i = 0; i < options.length; i++) {
            var move = {};
            move.coord = getCoord(options[i]);
            move.elem = copy[move.coord.x][move.coord.y];
            copy[move.coord.x][move.coord.y].className = player;
            var res;
            if(player == 'o'){
                res = tableEvaluator(copy,'x');
                move.score = res.score;
            }
            else {
                res = tableEvaluator(copy,'o');
                move.score = res.score;
            }
            possibleMoves.push(move);
        }

        var bestMove;
        if (player == 'x'){
            var bestScore = 10000;
          for(var i = 0; i < possibleMoves.length; i++) {
                if(possibleMoves[i].score < bestScore){
                    bestScore = possibleMoves[i].score;
                    bestMove = possibleMoves[i];
                }
            }
        }
        else {
            var bestScore = -10000;
            for(var i = 0; i < possibleMoves.length; i++) {
                if(possibleMoves[i].score > bestScore){
                    bestScore = possibleMoves[i].score;
                    bestMove = possibleMoves[i];
                }
            }
        return bestMove;
        }
    }
}
function getCoord(elem){
    return {
        x:elem.getAttribute('data-col'),
        y:elem.getAttribute('data-row')
    };
}
function deepCopy(table){
    var toReturn = [];
    for(var i = 0; i < 3; i++){
        var arr = [];
        arr.push(table[i][0]);
        arr.push(table[i][1]);
        arr.push(table[i][2]);
        toReturn.push(arr);
    }
    return toReturn;
}

function makeMove(){
    var move = tableEvaluator(table,'o');
    move.elem.className.add('o');
    turn = 'x';
}
