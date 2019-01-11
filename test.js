// if board.emptyTiles are not correct in relation to map, changes it to the correct one
function setEmptyTilesByMap(board) {
	board.emptyCells.a = [];
	for (let i = 0; i < board.map.length; i++) {
		for (let j = 0; j < board.map[i].length; j++) {
			if (board.map[i][j] == 0) {
				// add empty tile
				board.emptyCells.addNew(i, j);
				console.log("added: " + i +  " " + j);
			}
		}
	}
}

describe("Board", function() {
	describe("arraysEqual()", function() {
	  it("Checks whether two two-dimensinal square arrays are equal", function() {
	  	let a1 = [[3, 4], [2, 6]];
	  	let a2 = [[3, 4], [2, 6]];
	    assert.equal((new Board()).arraysEqual(a1, a2), true);

	    a1 = [[3, 4], [2, 6]];
	  	a2 = [[3, 4], [3, 6]];
	    assert.equal((new Board()).arraysEqual(a1, a2), false);
	  });
	});

	describe("isFull()", function() {
		it("Checks whether game map is full", function () {
			let board = new Board;
	    	assert.equal(board.isFull(), false);

	    	board.mapSize = 2;
	    	board.map = [
	    	[2, 4],
	    	[8, 16]
	    	];
	    	setEmptyTilesByMap(board);
	    	assert.equal(board.isFull(), true);

	    	board.map = [
	    	[2, 4],
	    	[8, 0]
	    	];
	    	setEmptyTilesByMap(board);
	    	assert.equal(board.isFull(), false);

	    	board.map = [
	    	[2, 4],
	    	[0, 16]
	    	];
	    	setEmptyTilesByMap(board);
	    	assert.equal(board.isFull(), false);

	    	board.map = [
	    	[0, 4],
	    	[8, 16]
	    	];
	    	setEmptyTilesByMap(board);
	    	assert.equal(board.isFull(), false);

	    	board.map = [
	    	[2, 0],
	    	[8, 16]
	    	];
	    	setEmptyTilesByMap(board);
	    	assert.equal(board.isFull(), false);
		});
	});

	describe("isMovePossible()", function() {
		let board = new Board;

		it ("Move is possible after construction", function() {
			assert.equal(board.isMovePossible(), true);
		});

		it ("Move is not possible when the map is full", function() {
			board.mapSize = 2;
		    board.map = [
		    [2, 4],
		    [8, 16]
		    ];
	    	setEmptyTilesByMap(board);
			assert.equal(board.isMovePossible(), false);
		});

		it ("Move is possible when the map is not full", function() {
			board.mapSize = 2;
		    board.map = [
		    [2, 0],
		    [8, 16]
		    ];
	    	setEmptyTilesByMap(board);
			assert.equal(board.isMovePossible(), true);
		});

		it ("Score doesn't changes after checking", function() {
			board.mapSize = 2;
		    board.map = [
		    [2, 2],
		    [2, 2]
		    ];
	    	setEmptyTilesByMap(board);
		    let curScore = board.score;
		    board.isMovePossible()
			assert.equal(curScore == board.score, true);
		});
	});

	describe("spawnNew()", function() {
		it ("Correct random spawn", function() {
			let board = new Board;
			board.mapSize = 2;
			board.map = [
			[2, 4],
			[4, 0]
			];
	    	setEmptyTilesByMap(board);
			board.spawnNew();
			assert.equal(board.map[1][1] == 2 || board.map[1][1] == 4, true);

			board.map = [
			[2, 4],
			[0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.spawnNew();
			assert.equal(board.map[1][1] == 2 || board.map[1][0] == 2 
				|| board.map[1][1] == 4 || board.map[1][0] == 4, true);
		});
	});

	describe("move()", function() {
		let board = new Board;

		it ("Nothing changes if move isn't possible", function() {
			board.mapSize = 2;
			let mapBefore = [
			[2, 4],
			[4, 0]
			];
	    	setEmptyTilesByMap(board);
			board.map = mapBefore;
			let scoreBefore = board.score;
			board.move(Direction.UP);
			assert.equal(board.arraysEqual(mapBefore, board.map), true);
			assert.equal(scoreBefore == board.score, true);
		});

		it ("Nothing changes if move isn't possible", function() {
			board.mapSize = 2;
			let mapBefore = [
			[2, 4],
			[4, 0]
			];
	    	setEmptyTilesByMap(board);
			board.map = mapBefore;
			let scoreBefore = board.score;
			board.move(Direction.LEFT);
			assert.equal(board.arraysEqual(mapBefore, board.map), true);
			assert.equal(scoreBefore == board.score, true);
		});

		it ("Map changes and spawns new tile correctly", function() {
			board.mapSize = 2;
			board.map = [
			[2, 4],
			[4, 0]
			];
	    	setEmptyTilesByMap(board);
			let expectedMap1 = [
			[2, 2],
			[4, 4]
			];
			let expectedMap2 = [
			[2, 4],
			[4, 4]
			];
			let scoreBefore = board.score;
			board.move(Direction.DOWN);
			assert.equal(board.arraysEqual(expectedMap1, board.map) || board.arraysEqual(expectedMap2, board.map), true);
			assert.equal(scoreBefore == board.score, true);
		});

		it ("Map changes and spawns new tile correctly", function() {
			board.mapSize = 2;
			board.map = [
			[2, 4],
			[4, 0]
			];
	    	setEmptyTilesByMap(board);
			let expectedMap1 = [
			[2, 4],
			[2, 4]
			];
			let expectedMap2 = [
			[2, 4],
			[4, 4]
			];
			let scoreBefore = board.score;
			board.move(Direction.RIGHT);
			assert.equal(board.arraysEqual(expectedMap1, board.map) || board.arraysEqual(expectedMap2, board.map), true);
			assert.equal(scoreBefore == board.score, true);
		});

		it("Hard case", function() {
			board.mapSize = 3;
			board.map = [
				[2, 2, 2],
				[2, 2, 2],
				[2, 2, 2]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[0][1] == 4 && board.map[0][2] == 4 &&
				board.map[1][0] == 2 && board.map[1][1] == 2 && board.map[1][2] == 2, true)
		});

		it("Hard case", function() {
			board.mapSize = 3;
			board.map = [
				[4, 4, 4],
				[2, 2, 2],
				[2, 2, 2]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[0][1] == 4 && board.map[0][2] == 4 &&
				board.map[1][0] == 4 && board.map[1][1] == 4 && board.map[1][2] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 3;
			board.map = [
				[4, 4, 4],
				[2, 2, 2],
				[4, 4, 4]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[0][1] == 4 && board.map[0][2] == 4 &&
				board.map[1][0] == 2 && board.map[1][1] == 2 && board.map[1][2] == 2 &&
				board.map[2][0] == 4 && board.map[2][1] == 4 && board.map[2][2] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 3;
			board.map = [
				[2, 2, 2],
				[2, 2, 2],
				[4, 4, 4]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[0][1] == 4 && board.map[0][2] == 4 &&
				board.map[1][0] == 4 && board.map[1][1] == 4 && board.map[1][2] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[4, 0, 0, 0],
				[4, 0, 0, 0],
				[2, 0, 0, 0],
				[2, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 8 && board.map[1][0] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[2, 0, 0, 0],
				[2, 0, 0, 0],
				[2, 0, 0, 0],
				[2, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[1][0] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[4, 0, 0, 0],
				[0, 0, 0, 0],
				[4, 0, 0, 0],
				[4, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 8 && board.map[1][0] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[2, 0, 0, 0],
				[2, 0, 0, 0],
				[2, 0, 0, 0],
				[4, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[1][0] == 2 && board.map[2][0] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[2, 0, 0, 0],
				[2, 0, 0, 0],
				[0, 0, 0, 0],
				[4, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[1][0] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[2, 0, 0, 0],
				[0, 0, 0, 0],
				[2, 0, 0, 0],
				[4, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[1][0] == 4, true)
		});

		it("Hard case", function() {
			board.mapSize = 4;
			board.map = [
				[0, 0, 0, 0],
				[2, 0, 0, 0],
				[2, 0, 0, 0],
				[4, 0, 0, 0]
			];
	    	setEmptyTilesByMap(board);
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[1][0] == 4, true)
		});
	});
});

describe("List", function() {
	describe("construtor()", function() {
	  it("adds all cells from the NxN map", function() {
	  	let list = new List(2);
	  	let map = [[false, false], [false, false]];
	  	for (let i = 0; i < list.a.length; i++) {
	  		map[list.a[i].i][list.a[i].j] = true;
	  	}
	    assert.equal(map[0][0] && map[0][1] && map[1][0] && map[1][1], true);
	  });

	  it("adds non-existing element", function() {
	  	let list = new List(2);
	  	list.addNew(5, 2);
	  	let is = false;
	  	for (let i = 0; i < list.a.length; i++) {
	  		if (list.a[i].i == 5 && list.a[i].j == 2) is = true;
	  	}
	  	assert.equal(is, true);
	  });

	   it("deletes existing element", function() {
	  	let list = new List(2);
	  	list.delete(0, 1);
	  	let is = false;
	  	for (let i = 0; i < list.a.length; i++) {
	  		if (list.a[i].i == 0 && list.a[i].j == 1) is = true;
	  	}
	  	assert.equal(is, false);
	  });
	});
});