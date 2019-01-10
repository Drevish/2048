// keyboard arrows
document.addEventListener('keydown', (event) => {
	if (!gameStarted) return;

	if(event.key == "ArrowUp") makeMove(Direction.UP);
	if(event.key == "ArrowDown") makeMove(Direction.DOWN);
	if(event.key == "ArrowLeft") makeMove(Direction.LEFT);
	if(event.key == "ArrowRight") makeMove(Direction.RIGHT);
});


// for mobile devices

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

// new game buttons
document.querySelectorAll('button.new-game').forEach(function(e) {
	e.addEventListener("click", function(e){
		gameStart();
	});
});