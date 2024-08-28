var worldGrid = [];

function colRowToIndex (c,r){
    return c+r*GRID_COLUMNS;
}

function pixelCoordToIndex(x,y){
    var c = Math.floor(x/GRID_WIDTH);
    var r = Math.floor(y/GRID_HEIGHT);
    return c+r*GRID_COLUMNS;
}
function initializeWorldGrid(){
    for(var i = 0; i < GRID_COLUMNS; i++){
        for(var ii = 0; ii < GRID_ROWS; ii++){
            worldGrid[colRowToIndex (i,ii)] = null;
        }
    }
}

function addUnitToGrid(unit){
    var unitC = Math.floor(unit.x/GRID_WIDTH);
    var unitR = Math.floor(unit.y/GRID_HEIGHT);
    var unitIndex = colRowToIndex(unitC,unitR);
    if(worldGrid[unitIndex] == null){
        worldGrid[unitIndex] = [unit];
    } else {
        worldGrid[unitIndex].push(unit);
    }
}

function drawGridDebug(){
    if(showGrid){
        for(var i = 0; i < GRID_COLUMNS; i++){
            for(var ii = 0; ii < GRID_ROWS; ii++){
                var xPos = i * GRID_WIDTH;
                var yPos = ii * GRID_HEIGHT;
                var index = colRowToIndex(i,ii);
                var color = (worldGrid[index] == null ? "white" : "lime");
                coloredOutlineRectCornerToCorner(xPos, yPos, xPos + GRID_WIDTH-1, yPos + GRID_HEIGHT-1, color);
            }
        }
    }
}