// class that is used for empty tiles storing
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