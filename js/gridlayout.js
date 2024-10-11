var grid = []; // array of GridElement instances, gets initialized based on tileGrid
const NOTHING = 20;
const SOURCE = 21;
const DEST = 22;
const WALL = 23;
const VISITED = 24;
const PATH = 25;

const INFINITY_START_DISTANCE = 999999;

function tileCoordToIndex(tileCol, tileRow) {
    return (tileCol + GRID_COLUMNS * tileRow);
}

function pixCoordToIndex(pX, pY){
	var col = Math.floor(pX/GRID_WIDTH);
	var row = Math.floor(pY/GRID_HEIGHT);
	
	return tileCoordToIndex(col, row);
}

function drawPathingFindingTiles() {
    var tileCount = GRID_COLUMNS * GRID_ROWS;
    for (var eachTil = 0; eachTil < tileCount; eachTil++) {
        grid[eachTil].display();
    } // end of for eachTil
} // end of drawTiles()
