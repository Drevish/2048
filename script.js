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
		for (let i = 0; i < this.boardSize; i++)
			for (let j = 0; j < this.boardSize; j++)
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

	isMovePossible() {
		// TODO
		return true;
	}

	spawnNew() {
		if (this.isMovePossible()) {
			while(true){
				let i = Math.floor(Math.random() * this.mapSize);
				let j = Math.floor(Math.random() * this.mapSize);
				if (this.map[i][j] == 0) {
					if (this.score >= 100 && Math.random() < 0.2) 
						this.map[i][j] = 4;
					else						
						this.map[i][j] = 2;
					return;
				}
			}
		}
	}

	moveMap(direction){
		let map = this.map;

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
					if (map[newI][j] == curVal) {
						map[newI][j] = curVal * 2;
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
					if (map[newI][j] == curVal) {
						map[newI][j] = curVal * 2;
						this.score += curVal * 2;
					}
				}
			}
		}

		return map;
	}

	move(direction) {
		this.map = this.moveMap(direction);

		this.spawnNew();
	}
}


let canvas = document.getElementById('gameCanvas');
let map = [
[0, 0, 2, 0],
[2, 4, 0, 0],
[4, 2, 0, 8],
[8, 8, 0, 2]
];

let board = new Board(4);
board.spawnNew();

let drawer = new Drawer(canvas, CANVAS_SIZE);
drawer.drawMap(board.map);

let gameStarted = true;

document.addEventListener('keydown', (event) => {
	if(event.key == "ArrowUp") board.move(Direction.UP);
	if(event.key == "ArrowDown") board.move(Direction.DOWN);
	drawer.drawMap(board.map);
	document.querySelector('.score').innerText = "Score: " + board.score;
	console.log(board.map);
});