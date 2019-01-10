const END_GAME_QUERY = ".game-field-wrapper .end-game-info";

// gets a cookie value with a specified name
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

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

	// refresh score
	document.querySelector(SCORE_QUERY).innerText = board.score;

	//update best score
	if (bestScore < board.score) {
		bestScore = board.score;

		// refresh best score
		document.querySelector(BEST_SCORE_QUERY).innerText = bestScore;

		// update best score in cookie
		var date = new Date(new Date().getTime() + 100000000000000);
		document.cookie = "best=" + bestScore + "; path=/; expires=" + date.toUTCString();
	}

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