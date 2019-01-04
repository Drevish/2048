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

	moveMap(direction){
		// copy this.map to the map
		let map = this.map

		// flag that is true if at least one tile has changed it's location
		let somethingChanged = false;

		let changedTiles = [];
		for (let i = 0; i < this.mapSize; i++) {
			changedTiles[i] = [];
			for (let j = 0; j < this.mapSize; j++) {
				changedTiles[i][j] = false;
			}
		}

		if(direction == Direction.UP) {
			for (let j = 0; j < this.mapSize; j++) {
				for (let i = 1; i < this.mapSize; i++) {
					if (map[i][j] == 0) continue;
					let newI = i;
					let curVal = map[i][j];
					for (let k = i - 1; k >= 0; k--) {
						if (map[k][j] == 0) {
							newI = k;
							continue;
						}
						if (map[k][j] != curVal) break;
						if (map[k][j] == curVal) {
							newI = k; 
							break;
						}
					}
					if (newI == i) continue;
					map[i][j] = 0;
					somethingChanged = true;
					this.emptyCells.addNew(i, j);
					if (map[newI][j] == 0) {
						map[newI][j] = curVal;
						this.emptyCells.delete(newI, j);
						continue;
					}
					if (map[newI][j] == curVal && changedTiles[newI][j] == true) {
						map[newI + 1][j] = curVal;
						this.emptyCells.delete(newI + 1, j);
						continue;
					}
					if (map[newI][j] == curVal && changedTiles[newI][j] == false) {
						map[newI][j] = curVal * 2;
						changedTiles[newI][j] = true;
						this.score += curVal * 2;
					}
				}
			}
		}


		if(direction == Direction.DOWN) {
			for (let j = 0; j < this.mapSize; j++) {
				for (let i = this.mapSize - 2; i >= 0; i--) {
					if (map[i][j] == 0) continue;
					let newI = i;
					let curVal = map[i][j];
					for (let k = i + 1; k < this.mapSize; k++) {
						if (map[k][j] == 0) {
							newI = k;
							continue;
						}
						if (map[k][j] != curVal) break;
						if (map[k][j] == curVal) {
							newI = k; 
							break;
						}
					}
					if (newI == i) continue;
					map[i][j] = 0;
					somethingChanged = true;
					this.emptyCells.addNew(i, j);
					if (map[newI][j] == 0) {
						map[newI][j] = curVal;
						this.emptyCells.delete(newI, j);
						continue;
					}
					if (map[newI][j] == curVal && changedTiles[newI][j] == true) {
						map[newI - 1][j] = curVal;
						this.emptyCells.delete(newI - 1, j);
						continue;
					}
					if (map[newI][j] == curVal && changedTiles[newI][j] == false) {
						map[newI][j] = curVal * 2;
						changedTiles[newI][j] = true;
						this.score += curVal * 2;
					}
				}
			}
		}


		if(direction == Direction.LEFT) {
			for (let i = 0; i< this.mapSize; i++) {
				for (let j = 1; j < this.mapSize; j++) {
					if (map[i][j] == 0) continue;
					let newJ = j;
					let curVal = map[i][j];
					for (let k = j - 1; k >= 0; k--) {
						if (map[i][k] == 0) {
							newJ = k;
							continue;
						}
						if (map[i][k] != curVal) break;
						if (map[i][k] == curVal) {
							newJ = k; 
							break;
						}
					}
					if (newJ == j) continue;
					map[i][j] = 0;
					somethingChanged = true;
					this.emptyCells.addNew(i, j);
					if (map[i][newJ] == 0) {
						map[i][newJ] = curVal;
						this.emptyCells.delete(i, newJ);
						continue;
					}
					if (map[i][newJ] == curVal && changedTiles[i][newJ] == true) {
						map[i][newJ + 1] = curVal;
						this.emptyCells.delete(i, newJ + 1);
						continue;
					}
					if (map[i][newJ] == curVal && changedTiles[i][newJ] == false) {
						map[i][newJ] = curVal * 2;
						changedTiles[i][newJ] = true;
						this.score += curVal * 2;
					}
				}
			}
		}


		if(direction == Direction.RIGHT) {
			for (let i = 0; i< this.mapSize; i++) {
				for (let j = this.mapSize - 2; j >= 0; j--) {
					if (map[i][j] == 0) continue;
					let newJ = j;
					let curVal = map[i][j];
					for (let k = j + 1; k < this.mapSize; k++) {
						if (map[i][k] == 0) {
							newJ = k;
							continue;
						}
						if (map[i][k] != curVal) break;
						if (map[i][k] == curVal) {
							newJ = k; 
							break;
						}
					}
					if (newJ == j) continue;
					map[i][j] = 0;
					somethingChanged = true;
					this.emptyCells.addNew(i, j);
					if (map[i][newJ] == 0) {
						map[i][newJ] = curVal;
						this.emptyCells.delete(i, newJ);
						continue;
					}
					if (map[i][newJ] == curVal && changedTiles[i][newJ] == true) {
						map[i][newJ - 1] = curVal;
						this.emptyCells.delete(i, newJ - 1);
						continue;
					}
					if (map[i][newJ] == curVal && changedTiles[i][newJ] == false) {
						map[i][newJ] = curVal * 2;
						changedTiles[i][newJ] = true;
						this.score += curVal * 2;
					}
				}
			}
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


// let canvas = document.getElementById('gameCanvas');
let drawer = new Drawer(/*canvas, CANVAS_SIZE*/);
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