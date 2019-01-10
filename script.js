'use strict';

// default map size
const MAP_SIZE = 4;
const SCORE_QUERY = '.score .my-button-number';
const BEST_SCORE_QUERY = '.bestScore .my-button-number';

// direction enumeration for the convenient representation	
let Direction = {
	UP: 	0,
	RIGHT: 	1,
	DOWN: 	2,
	LEFT: 	3
};

// simple class that stores two values
class Cell {
	constructor (i, j) {
		this.i = i;
		this.j = j;
	}
}


let drawer = new Drawer();
let board;
let gameStarted

// getting best score from cookie
let bestScore = getCookie("best");
if (bestScore === undefined) bestScore = 0;

// refresh best score
document.querySelector(BEST_SCORE_QUERY).innerText = bestScore;

gameStart();