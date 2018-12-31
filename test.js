
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
	    	assert.equal(board.isFull(), true);

	    	board.map = [
	    	[2, 4],
	    	[8, 0]
	    	];
	    	assert.equal(board.isFull(), false);

	    	board.map = [
	    	[2, 4],
	    	[0, 16]
	    	];
	    	assert.equal(board.isFull(), false);

	    	board.map = [
	    	[0, 4],
	    	[8, 16]
	    	];
	    	assert.equal(board.isFull(), false);

	    	board.map = [
	    	[2, 0],
	    	[8, 16]
	    	];
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
			assert.equal(board.isMovePossible(), false);
		});

		it ("Move is possible when the map is not full", function() {
			board.mapSize = 2;
		    board.map = [
		    [2, 0],
		    [8, 16]
		    ];
			assert.equal(board.isMovePossible(), true);
		});

		it ("Score doesn't changes after checking", function() {
			board.mapSize = 2;
		    board.map = [
		    [2, 2],
		    [2, 2]
		    ];
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
			board.spawnNew();
			assert.equal(board.map[1][1] == 2 || board.map[1][1] == 4, true);

			board.map = [
			[2, 4],
			[0, 0]
			];
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
			board.move(Direction.UP);
			assert.equal(board.map[0][0] == 4 && board.map[1][0] == 4, true)
		});
	});
});
