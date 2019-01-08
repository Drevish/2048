// function that is used at the start of a new game
function gameStart() {
	// creating new game board
	board = new Board(4);

	// spawn two initial tiles
	board.spawnNew();
	board.spawnNew();

	// displaying map
	drawer.drawMap(board.map);

	gameStarted = true;

	// score refreshing
	document.querySelector(SCORE_QUERY).innerText = "0";
}

// function that is used every time user makes a move
function makeMove(direction) {
	board.move(direction);

	drawer.drawMap(board.map);

	// scores
	document.querySelector(SCORE_QUERY).innerText = board.score;
	if (bestScore < board.score) bestScore = board.score;
	document.querySelector(BEST_SCORE_QUERY).innerText = bestScore;

	if (!board.isMovePossible()) {
		gameEnd();	
	}
}

// function that is used at the end of the game
function gameEnd() {
	drawer.drawMap(board.map);
	gameStarted = false;
	alert("The end! Your score: " + board.score);
}