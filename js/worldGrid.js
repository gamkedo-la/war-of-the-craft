var worldGrid = [];
var collGrid = [];
const COLL_EMPTY = 0;
const COLL_SOLID = 1;

const GRID_ROWS = 100;
const GRID_COLUMNS = 100;
const GRID_WIDTH = 32;
const GRID_HEIGHT = 32;
const WORLD_SIZE_PIXELS_W = GRID_ROWS * GRID_WIDTH;
const WORLD_SIZE_PIXELS_H = GRID_COLUMNS * GRID_HEIGHT;
var showGrid = true;
var  walkableTiles = [];

// these are tiles that have water on them in the background.png
const presetUnwalkableTiles = [400,401,500,501,600,601,700,49,50,51,65,66,67,68,69,70,
    1899,1999,1998,2099,2098,2097,2096,2095,2195,2196,2197,2198,2199,2295,2296,2297,2298,
    2299,2395,2396,2397,2398,2399,2496,2497,2498,2499,2596,2597,2598,2599,2698,2699,9798,
    9799,9897,9898,9899,9997,9998,9999,9859,9860,9861,9956,9957,9958,9959,9960,9961,9962,
    3008,3009,3010,3011,3012,3107,3108,3109,3110,3111,3112,3113,3200,3201,3202,3203,3204,
    3205,3206,3207,3208,3209,3210,3211,3212,3213,3214,3300,3301,3302,3303,3304,3305,3306,
    3307,3308,3309,3310,3311,3312,3313,3314,3315,3400,3401,3402,3403,3404,3405,3406,3407,
    3408,3409,3410,3411,3412,3413,3414,3415,3500,3501,3502,3503,3504,3505,3511,3512,3513,
    3514,3515,3516,3517,3518,3615,3616,3617,3618,3619,3716,3717,3718,3719,3720,3818,3819,
    3820,3918,3919,3920,4018,4019,4020,4118,4119,4120,4113,4200,4211,4212,4213,4214,4217,
    4218,4219,4220,4300,4301,4310,4311,4312,4313,4314,4315,4316,4317,4318,4319,4320,4400,
    4401,4402,4403,4404,4405,4406,4407,4408,4409,4410,4411,4412,4413,4414,4415,4416,4417,
    4418,4419,4420,4500,4501,4502,4503,4504,4505,4506,4507,4508,4509,4510,4511,4512,4513,
    4514,4515,4516,4517,4518,4519,4600,4601,4602,4603,4604,4605,4606,4607,4608,4609,4701,4702,4703,
    8717,8718,8719,8816,8817,8818,8819,8820,8821,8822,8916,8917,8918,8919,8920,8921,8922,
    8923,9015,9016,9017,9018,9019,9020,9021,9022,9023,9123,9122,9121,9120,9118,9117,9116,
    9115,9114,9113,9112,9209,9210,9211,9212,9213,9214,9215,9216,9217,9220,9221,9222,9223,
    9322,9321,9320,9319,9318,9317,9316,9315,9314,9313,9312,9311,9310,9309,9408,9409,9410,
    9411,9412,9413,9414,9415,9416,9417,9418,9419,9420,9421,9519,9518,9517,9516,9512,9511,
    9510,9509,9508,9607,9608,9609,9610,9611,9612,9711,9710,9709,9708,9808,9809,9810,9909,
    9908,9907,9906
    ];

function drawHills(cols, rows, startCol, startRow){  //change this to a class
    var columns = cols;
    var rows = rows;
    var startX = startCol * 32;
    var startY = startRow * 32;
    var xPos = startX;
    var yPos = startY;
    for(var i = 0; i < rows; i++){
        for (var ii = 0; i < columns; i++){
            drawBitmapAtLocation(hillPic, xPos,yPos, 32,32,32,32*2)
        }
    }
}

function colRowToIndex (c,r){
    return c+r*GRID_COLUMNS;
}

function pixelCoordToIndex(x,y){
    var c = Math.floor(x/GRID_WIDTH);
    var r = Math.floor(y/GRID_HEIGHT);
    return c+r*GRID_COLUMNS;
}

function indexToPixelX (tile){
    var col = tile%GRID_COLUMNS;
    return col * GRID_WIDTH + 0.5 * GRID_WIDTH;
}

function indexToPixelY (tile){
    var row = Math.floor(tile/GRID_COLUMNS);
    return row * GRID_HEIGHT + 0.5 * GRID_HEIGHT;
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

function tileTypeWalkable(checkTileType){
    return walkableTiles.includes(checkTileType);
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

            // avoid areas with water drawn in the background
            if (presetUnwalkableTiles.indexOf(index)!=-1) {
                sum += 1;
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
                if (collGrid[index] == COLL_SOLID) {
                    colorRect(xPos, yPos, GRID_WIDTH, GRID_HEIGHT, "rgba(255,0,0,0.4)");
                } else {
                    coloredOutlineRectCornerToCorner(xPos, yPos, xPos + GRID_WIDTH-1, yPos + GRID_HEIGHT-1, "rgba(255,255,255,0.15)");
                }
            }
        }
    }
}