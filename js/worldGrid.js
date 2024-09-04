var worldGrid = [];
var collGrid = [];
const COLL_EMPTY = 0;
const COLL_SOLID = 1;

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
            var index = colRowToIndex (i,ii); 
            worldGrid[index] = null;
            collGrid[index] = COLL_EMPTY;
        }
    }
}

function refreshCollisionGrid(){
    var debugSolidCount = 0;
    for(var i = 0; i < GRID_COLUMNS; i++){
        for(var ii = 0; ii < GRID_ROWS; ii++){
            var index = colRowToIndex (i,ii);
            var sum = 0;
            if(worldGrid[index] != null){
                for(var iii = 0; iii < worldGrid[index].length; iii++){
                    sum += worldGrid[index][iii].collFill;
                }
            }
            if(sum >= 1){
                debugSolidCount++;
                collGrid[index] = COLL_SOLID;
            } else {
                collGrid[index] = COLL_EMPTY;
            }
        }
    }
}

function addUnitToGrid(unit){
    var unitC = Math.floor(unit.x/GRID_WIDTH);
    var unitR = Math.floor(unit.y/GRID_HEIGHT);
    var unitIndex = colRowToIndex(unitC,unitR);
    addUnitToGridIndex(unit,unitIndex)
}
function addUnitToGridIndex(unit,unitIndex){
    if(worldGrid[unitIndex] == null){
        worldGrid[unitIndex] = [unit];
    } else {
        worldGrid[unitIndex].push(unit);
    }
}
function removeUnitFromGridIndex(unit,unitIndex){
    worldGrid[unitIndex]=worldGrid[unitIndex].filter(item => item !== unit);
    if(worldGrid[unitIndex].length==0) {
        worldGrid[unitIndex]=null;
    }
}

function returnUnitsInNearbyTiles(col,row, tileDist){
    var leftEdge = col-tileDist;
    var rightEdge = col+tileDist;
    var topEdge = row-tileDist;
    var bottomEdge = row+tileDist;

    if(leftEdge < 0){
        leftEdge = 0;
    }
    if(rightEdge >= GRID_COLUMNS){
        rightEdge = GRID_COLUMNS - 1;
    }
    if(topEdge < 0){
        topEdge = 0;
    }
    if(bottomEdge >= GRID_ROWS){
        bottomEdge = GRID_ROWS - 1;
    }

    var unitList = [];
    for (var c = leftEdge; c< rightEdge + 1; c++){
       for(var r = topEdge; r < bottomEdge + 1; r++){
        var index = colRowToIndex(c,r);
        if(worldGrid[index] != null){
            unitList.push(...worldGrid[index]); //... spills the array elements
        }
       } 
    }
    return unitList;
}

function drawGridDebug(){
    if(showGrid){
        for(var i = 0; i < GRID_COLUMNS; i++){
            for(var ii = 0; ii < GRID_ROWS; ii++){
                var xPos = i * GRID_WIDTH;
                var yPos = ii * GRID_HEIGHT;
                var index = colRowToIndex(i,ii);
                var color = (collGrid[index] == COLL_SOLID ? "red" : "yellow");
                coloredOutlineRectCornerToCorner(xPos, yPos, xPos + GRID_WIDTH-1, yPos + GRID_HEIGHT-1, color);
            }
        }
    }
}