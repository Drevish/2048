// class that is used to draw the map as a table
// used to extend the game from 4x4 to NxN in future

let TABLE_QUERY = 'table#game-field';

class Drawer {
	constructor() {}

	// refresh map on the screen
	drawMap(map) {
		let table = document.querySelector(TABLE_QUERY);

		let s = "";
		// every row
		for (let i = 0; i < 4; i++) {
			s += "<tr>";

			// every tile
			for (let j = 0; j < 4; j++) {
				s += "<td class='tile-";
				s += map[i][j];
				s += "'></td>";
			}
			
			s += "</tr>"
		}

		table.innerHTML = s;
	}
}
