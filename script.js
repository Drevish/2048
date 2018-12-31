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

class Drawer {
	constructor(canvas, canvasSize) {
		this.canvasSize = canvasSize;
		this.cx = canvas.getContext("2d");

		// setting up canvas size		
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		// tiles settings
		this.tilesColor = {
			0: '#CDC1B4',
			2: '#EEE4DA',
			4: '#EDE0C8',
			8: '#F2B179',
			16: '#F59563',
			32: '#F67C5F',
			64: '#F65E3B',
			128: '#EDCF72'
		}
	}

	drawMap(map) {
		let mapSize = map.length;
		// font setting
		this.cx.font = CANVAS_FONT;
		let fontColor = CANVAS_FONT_COLOR;

		// drawing tiles
		let tileSize = this.canvasSize / mapSize;
		map.forEach(function(row, i) {
			row.forEach(function(n, j) {
				// tile background filling
				this.cx.fillStyle = this.tilesColor[map[i][j]];
				this.cx.fillRect(tileSize * j, tileSize * i, tileSize * (j + 1), tileSize * (i + 1));

				// tile text writing
				this.cx.fillStyle = fontColor; // text color
				if (map[i][j] !== 0)
					this.cx.fillText(map[i][j], tileSize * j + tileSize / 2 - 15, tileSize * i + tileSize / 2 + 15);
			}.bind(this));
		}.bind(this));

		// drawing borders
		this.cx.strokeStyle = BORDERS_COLOR;	// borders color
		for (let i = 0; i < mapSize + 1; i++) {
			this.cx.beginPath();

			// border width setting
			if (i == 0 || i == mapSize) 
				this.cx.lineWidth = 20;
			else 
				this.cx.lineWidth = 10;

			// horizontal line
			this.cx.moveTo(0, tileSize * i);
			this.cx.lineTo(this.canvasSize, tileSize * i);
			// vertical line
			this.cx.moveTo(tileSize * i, 0);
			this.cx.lineTo(tileSize * i, this.canvasSize);

			this.cx.stroke();
		}
	}
}

class Board {
	isFull() {
		for (let i = 0; i < this.mapSize; i++)
			for (let j = 0; j < this.mapSize; j++)
				if (this.map[i][j] == 0) return false;
		return true;
	}

	constructor(mapSize) {
		if (mapSize == undefined) mapSize = MAP_SIZE;

		this.mapSize = mapSize;
		this.score = 0;

		this.map = [];
		for (let i = 0; i < mapSize; i++) {
			this.map[i] = [];
			for (let j = 0; j < mapSize; j++)
				this.map[i][j] = 0;
		}
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

	isMovePossible() {
		if(!this.isFull()) return true;
		for (let direction = Direction.UP; direction <= Direction.LEFT; direction++) {
			if (!this.arraysEqual(this.moveMap(direction), this.map)) return true;	
		}
		return false;
	}

	spawnNew() {
		while(true){
			let i = Math.floor(Math.random() * this.mapSize);
			let j = Math.floor(Math.random() * this.mapSize);
			if (this.map[i][j] == 0) {
				if (Math.random() < 0.2) 
					this.map[i][j] = 4;
				else						
					this.map[i][j] = 2;
				return;
			}
		}
	}

	moveMap(direction){
		// copy this.map to the map
		let map = [];
		for (let i = 0; i < this.mapSize; i++) {
			map[i] = [];
			for (let j = 0; j < this.mapSize; j++) 
				map[i][j] = this.map[i][j];
		}

		/*if (direction == Direction.UP || direction == Direction.DOWN) {
			for (let j = 0; j < this.mapSize; j++) {
				if (direction == Direction.UP) {
					for (let i = 1; i < this.mapSize; i++) {
						moveF(i, j, map, direction);
					}
				}
				if (direction == Direction.DOWN) {
					for (let i = this.mapSize - 2; i >= 0; i--) {
						moveF(i, j, map, direction);
					}
				}
			}
		} 
		if (direction == Direction.LEFT || direction == Direction.RIGHT) {
			for (let i = 0; i < this.mapSize; i++) {
				if (direction == Direction.LEFT) {
					for (let j = 1; j < this.mapSize; j++) {
						moveF(i, j, map, direction);
					}
				}
				if (direction == Direction.RIGHT) {
					for (let j = this.mapSize - 2; j >= 0; j--) {
						moveF(i, j, map, direction);
					}
				}
			}
		}*/

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
					if (map[newI][j] == 0) {
						map[newI][j] = curVal;
						continue;
					}
					if (map[newI][j] == curVal && changedTiles[newI][j] == true) {
						map[newI + 1][j] = curVal;
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
					if (map[newI][j] == 0) {
						map[newI][j] = curVal;
						continue;
					}
					if (map[newI][j] == curVal && changedTiles[newI][j] == true) {
						map[newI - 1][j] = curVal;
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
					if (map[i][newJ] == 0) {
						map[i][newJ] = curVal;
						continue;
					}
					if (map[i][newJ] == curVal && changedTiles[i][newJ] == true) {
						map[i][newJ + 1] = curVal;
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
					if (map[i][newJ] == 0) {
						map[i][newJ] = curVal;
						continue;
					}
					if (map[i][newJ] == curVal && changedTiles[i][newJ] == true) {
						map[i][newJ - 1] = curVal;
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

		return map;
	}

	// makes a move in a specified direction and spawns new tile if it's possible
	move(direction) {
		let newMap = this.moveMap(direction);
		let mapsEqual = this.arraysEqual(this.map, newMap);
		if (mapsEqual) return;

		this.map = newMap;

		this.spawnNew();
	}
}


let canvas = document.getElementById('gameCanvas');
let drawer = new Drawer(canvas, CANVAS_SIZE);
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
	document.querySelector('.score').innerText = "Score: 0";
}


document.addEventListener('keydown', (event) => {
	if (!gameStarted) return;

	if(event.key == "ArrowUp") board.move(Direction.UP);
	if(event.key == "ArrowDown") board.move(Direction.DOWN);
	if(event.key == "ArrowLeft") board.move(Direction.LEFT);
	if(event.key == "ArrowRight") board.move(Direction.RIGHT);

	drawer.drawMap(board.map);

	// scores
	document.querySelector('.score').innerText = "Score: " + board.score;
	if (bestScore < board.score) bestScore = board.score;
	document.querySelector('.bestScore').innerText = "Best: " + bestScore;

	if (!board.isMovePossible()) {
		gameStarted = false;
		alert("The end! Your score: " + board.score);
	}
});




// new game button
document.querySelector('button.new-game').addEventListener("click", function(e){
	gameStart();
})