'use strict';

const CANVAS_SIZE = 500;
const MAP_SIZE = 4;
const CANVAS_FONT = "50px Arial";
const CANVAS_FONT_COLOR = "#776E65";
const BORDERS_COLOR = '#BBADA0';

let Direction = {
	UP: 	0,
	RIGHT: 	1,
	DOWN: 	2,
	LEFT: 	3
};

// class that is used to draw the map as a table
// used to extend the game from 4x4 to NxN in future
class Drawer {
	constructor() {}

	// refresh map on the screen
	drawMap(map) {
		let table = document.querySelector('table#game-field');
		let s = "";
		for (let i = 0; i < 4; i++) {
			s += "<tr>";
			for (let j = 0; j < 4; j++) {
				s += "<td class='tile-";
				s += map[i][j];
				s += "'>";
				if (map[i][j] != 0) s+= map[i][j];
				else s+= "";
				s += "</td>";
			}
			s += "</tr>"
		}
		table.innerHTML = s;
	}
}

// simple class that stores two values
class Cell {
	constructor (i, j) {
		this.i = i;
		this.j = j;
	}
}

// class for empty tiles storing
// contains a list of Cell objects
class List {
	constructor(n) {
		this.a = [];

		// empty map n x n so that every tile should be added to the list
		if (n !== undefined) {
			let counter = 0;
			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) {
					this.a[counter++] = new Cell(i, j);
				}
			}
		}
	}

	// adds a new Cell element to the list
	addNew(i, j) {
		this.a[this.a.length] = new Cell(i, j);
	}

	// deletes (i, j) cell from the list
	delete(i, j) {
		for (let k = 0; k < this.a.length; k++) {
			if (this.a[k].i == i && this.a[k].j == j) {
				this.a.splice(k, 1);
				return;
			}
		}
	}

	// returns the number of elements in the list
	size() {
		return this.a.length;
	}

	// returns k-th element of the list 
	getK(k) {
		return this.a[k];
	}
}

class Board {
	constructor(mapSize) {
		// sets standard map size to 4 x 4 or whatever is setted up in a constant
		if (mapSize == undefined) mapSize = MAP_SIZE;

		this.mapSize = mapSize;
		this.score = 0;
		this.emptyCells = new List(this.mapSize);

		// initializes map with zeros
		this.map = [];
		for (let i = 0; i < mapSize; i++) {
			this.map[i] = [];
			for (let j = 0; j < mapSize; j++)
				this.map[i][j] = 0;
		}
	}

	// checks if the map is full
	// returns true if there are no empty cells and false otherwise
	isFull() {
		return (this.emptyCells.size() == 0);
	}

	// for square two-dimensinal arrays
	arraysEqual(a1, a2) {
		let equal = true;
		if (a1.length != a2.length) return false;
		for (let i = 0; i < a1.length; i++) {
			for (let j = 0; j < a1.length; j++) {
				if (a1[i][j] != a2[i][j]) return false;
			}
		}
		return true;
	}

	// checks whether something will change if user will make a move
	isMovePossible() {
		// if map is not full we always can make a move
		if(!this.isFull()) return true;

		// map is full so we can make a move only if there are two adjacent tiles with the same value
		// let's check only down and right sides to avoid repetitions
		for (let i = 0; i < this.mapSize; i++) {
			for (let j = 0; j < this.mapSize; j++) {
				if (i != this.mapSize - 1 && this.map[i][j] == this.map[i + 1][j]) {
					// we can move in a vertical direction
					return true;
				}
				if (j != this.mapSize - 1 && this.map[i][j] == this.map[i][j + 1]) {
					// we can move in a horizontal direction
					return true;
				}
			}
		}

		// move is impossible
		return false;
	}

	// spawns new 2 or 4 tile to the map or does nothing if the map is full
	spawnNew() {
		if (this.isFull()) return;
		// gets random empty cell and spawns there a tile
		let k = Math.floor(Math.random() * this.emptyCells.size());
		let i = this.emptyCells.getK(k).i;
		let j = this.emptyCells.getK(k).j;
		if (Math.random() < 0.1) {
			this.map[i][j] = 4;
		}
		else {	
			this.map[i][j] = 2;
		}
		this.emptyCells.delete(i, j);
	}

	// makes a move in a specified direction and returns true if the map was changed and false otherwise
	moveMap(direction) {
		// flag that is true if at least one tile has changed it's location
		let somethingChanged = false;

		/*
		 * array that stores information about tiles that was changed 
		 * we need it because by the rules we can't change the same tile twice so that 2222 
		 * can't be transformed to 8, we can transform it only to 44 
		 */
		let changedTiles = [];
		for (let i = 0; i < this.mapSize; i++) {
			changedTiles[i] = [];
			for (let j = 0; j < this.mapSize; j++) {
				changedTiles[i][j] = false;
			}
		}


		/*
		 * loop 1 - loop through columns or rows
		 * loop 2 - nested loop through tiles in a current column or row
		 * loop 3 - third loop which is when the current tile is already choosed and we 
		 *	 		have to watch the current column / row through to find the deadlock
		 */

		// true when we have to exit from this loop
		let loop1Exit = false;
		let loop2Exit = false;

		// loops variables
		let i = 0;
		let j = 0;
		let k = 0;

		// needs for every iteration through first loop, iterates first loop variable
		let loop1 = function(direction) {
			switch(direction) {
				case Direction.UP:
				case Direction.DOWN:
				// j from 0 to mapSize
				if (j < this.mapSize - 1) {
					j++;
				} else {
					loop1Exit = true;
				}
				break;

				case Direction.LEFT:
				case Direction.RIGHT:
				// i from 0 to mapSize
				if (i < this.mapSize - 1) {
					i++;
				} else {
					loop1Exit = true;
				}
				break;
			}
		}.bind(this);

		// needs for loop 2 variables initialization
		let loop2Init = function(direction) {
			switch(direction) {
				case Direction.UP:
				i = 1;
				break;

				case Direction.DOWN:
				i = this.mapSize - 2;
				break;

				case Direction.LEFT:
				j = 1;
				break;

				case Direction.RIGHT:
				j = this.mapSize - 2;
				break;
			}
		}.bind(this);

		// needs for every iteration through first loop, iterates second loop variable
		let loop2 = function(direction) {
			switch(direction) {
				case Direction.UP:
				// i from 1 to mapSize 
				if (i < this.mapSize - 1) {
					i++;
				} else {
					loop2Exit = true;
				}
				break;

				case Direction.DOWN:
				// i from mapSize - 2 to 0 inclusive
				if (i > 0) {
					i--;
				} else {
					loop2Exit = true;
				}
				break;

				case Direction.LEFT:
				// j from 1 to mapSize
				if (j < this.mapSize - 1) {
					j++;
				} else {
					loop2Exit = true;
				}
				break; 

				case Direction.RIGHT:
				// j from mapSize - 2 to 0 inclusive
				if (j > 0) {
					j--;
				} else {
					loop2Exit = true;
				}
				break;
			}
		}.bind(this);

		// needs for loop 2 variable initialization
		let loop3Init = function(direction) {
			switch(direction) {
				case Direction.UP: 
				case Direction.DOWN:
				k = i;
				break;

				case Direction.LEFT: 
				case Direction.RIGHT:
				k = j;
				break;
			}
		}.bind(this);

		// needs for every iteration through third loop, iterates k and
		// returns two values which are indexes for current tile looking for 
		let loop3 = function(direction) {
			switch(direction) {
				case Direction.UP:
				k--;
				return new Cell(k, j);

				case Direction.DOWN:
				k++;
				return new Cell(k, j);
				
				case Direction.LEFT:
				k--;
				return new Cell(i, k);
				
				case Direction.RIGHT:
				k++;
				return new Cell(i, k);
			}
		}

		// main loop
		while (!loop1Exit) {
			
			loop2Init(direction);
			while (!loop2Exit) {
				// loop code

				// empty tile, can't be transfered
				if (this.map[i][j] == 0) {					
					loop2(direction);
					continue;
				} 


				// current tile that may be transfered
				let currentValue = this.map[i][j];

				// tile where we are going to place the current one
				let newTile = new Cell(i, j);
				loop3Init(direction);
				while (true) {
					// tile that we are currently looking at in the loop represented as map coordinates
					let loopTile = loop3(direction);

					// out of range
					if (k < 0 || k >= this.mapSize) break;

					// tile that we are currently looking at value
					let loopTileValue = this.map[loopTile.i][loopTile.j];


					// empty loop, current can be transfered here
					if (loopTileValue == 0) {
						newTile = loopTile;
						continue;
					}

					// different tile, search stops
					if (loopTileValue != currentValue) {
						break;
					}

					// the same tile, we should transfer the current one there so the search stops
					if (loopTileValue == currentValue && changedTiles[loopTile.i][loopTile.j] == false) {
						newTile = loopTile;
						break;
					}

					// the same tile but it was already changed so we can't use it and have to use the previous one 
					if (loopTileValue == currentValue && changedTiles[loopTile.i][loopTile.j] == true) {
						break;
					}
				}

				// we are in deadlock, can't transfer current tile
				if (newTile.i == i && newTile.j == j) {
					loop2(direction);
					continue;
				}

				// erasing current value in map 
				this.map[i][j] = 0;
				this.emptyCells.addNew(i, j);
				somethingChanged = true;

				let newTileValue =this.map[newTile.i][newTile.j];

				// simply inserting current tile if insertion place is empty
				if (newTileValue == 0) {
					this.map[newTile.i][newTile.j] = currentValue;
					this.emptyCells.delete(newTile.i, newTile.j);
					
					loop2(direction);
					continue;
				}

				// doubling new tile value, increasing score, marking new tile as changed
				if (newTileValue == currentValue) {
					this.map[newTile.i][newTile.j] = currentValue * 2;
					changedTiles[newTile.i][newTile.j] = true;
					this.score += currentValue * 2;

					loop2(direction);
					continue;
				}

				loop2(direction);
			}
			loop2Exit = false;

			loop1(direction);
		}

		return somethingChanged;
	}

	// makes a move in a specified direction and spawns new tile if it's possible
	move(direction) {
		let somethingChanged = this.moveMap(direction);
		if (somethingChanged) {
			this.spawnNew();
		}
	}
}


let drawer = new Drawer();
let board;
let gameStarted

let bestScore = 0;
gameStart();


// game process initializing
function gameStart() {
	board = new Board(4);
	board.spawnNew();
	board.spawnNew();
	drawer.drawMap(board.map);
	gameStarted = true;
	document.querySelector('.score .my-button-number').innerText = "0";
}

function makeMove(direction) {
	board.move(direction);

	drawer.drawMap(board.map);

	// scores
	document.querySelector('.score .my-button-number').innerText = board.score;
	if (bestScore < board.score) bestScore = board.score;
	document.querySelector('.bestScore .my-button-number').innerText = bestScore;

	if (!board.isMovePossible()) {
		gameEnd();	
	}
}

function gameEnd() {
	drawer.drawMap(board.map);
	gameStarted = false;
	alert("The end! Your score: " + board.score);
}

document.addEventListener('keydown', (event) => {
	if (!gameStarted) return;

	if(event.key == "ArrowUp") makeMove(Direction.UP);
	if(event.key == "ArrowDown") makeMove(Direction.DOWN);
	if(event.key == "ArrowLeft") makeMove(Direction.LEFT);
	if(event.key == "ArrowRight") makeMove(Direction.RIGHT);

});


let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let gesuredZone = document.getElementById('game-field');

gesuredZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
    event.preventDefault();
    return false;
}, false);

gesuredZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesure();
    event.preventDefault();
    return false;
}, false); 

function handleGesure() {
	if (!gameStarted) return;

    let xDiff = Math.abs(touchstartX - touchendX);
    let yDiff = Math.abs(touchstartY - touchendY);
    if (xDiff > yDiff){ 
    	if (touchendX < touchstartX) {
        	makeMove(Direction.LEFT);
	    }
	    if (touchendX > touchstartX) {
	        makeMove(Direction.RIGHT);
	    }
    }
     else {
	    if (touchendY < touchstartY) {
	        makeMove(Direction.UP);
	    } 
	    if (touchendY > touchstartY) {
	    	makeMove(Direction.DOWN);
	    }
	}
}



// new game button
document.querySelector('button.new-game').addEventListener("click", function(e){
	gameStart();
})