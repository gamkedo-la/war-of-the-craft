var worldGrid = [];

function colRowToIndex (c,r){
    return c+r*GRID_COLUMNS;
}

function initializeWorldGrid(){
    for(var i = 0; i < GRID_COLUMNS; i++){
        for(var ii = 0; ii < GRID_ROWS; ii++){
            worldGrid[colRowToIndex (i,ii)] = null;
        }
    }
}

function drawGridDebug(){
    if(showGrid){
        for(var i = 0; i < GRID_COLUMNS; i++){
            for(var ii = 0; ii < GRID_ROWS; ii++){
                var xPos = i * GRID_WIDTH;
                var yPos = ii * GRID_HEIGHT;
                coloredOutlineRectCornerToCorner(xPos, yPos, xPos + GRID_WIDTH, yPos + GRID_HEIGHT, "WHITE");
            }
        }
    }
}