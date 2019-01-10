const END_GAME_QUERY = ".game-field-wrapper .end-game-info";

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

	// map opacity decreasing for 5s
	document.querySelector(TABLE_QUERY).style.transition = "0s";
	document.querySelector(TABLE_QUERY).style.opacity = "1";

	// game over text hiding
	document.querySelector(END_GAME_QUERY).style.display = "none";
}

var addRule = (function(style){
    var sheet = document.head.appendChild(style).sheet;
    return function(selector, css){
        var propText = Object.keys(css).map(function(p){
            return p+":"+css[p]
        }).join(";");
        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    }
})(document.createElement("style"));

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

	// map opacity decreasing for 3s
	document.querySelector(TABLE_QUERY).style.transition = "3s";
	document.querySelector(TABLE_QUERY).style.opacity = "0.35";

	// game over text showing
	setTimeout(() => {
	document.querySelector(END_GAME_QUERY).style.display = "inline-block";},
	2000);
}