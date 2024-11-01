// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
const PLAYER_PEASANT_START_UNITS = 1;
const PLAYER_WARRIOR_START_UNITS = 0;
const PLAYER_START_BUILDING = 1;
const ENEMY_GOBLIN_START_UNITS = 1;
const ENEMY_ORC_START_UNITS = 0
const ENEMY_START_BUILDING = 1;
const ENEMY_START_FARMS = 0;
const ENEMY_START_ORC_BARRACK = 0;
const PLAYER_START_FARMS = 0;
const STARTING_TREES = 5000;
const STARTING_MINES = 2;

var enemyUnits = [];
var playerUnits = [];
var buildingUnits = [];
var allUnits = [];
var trees = [];
var mines = [];
var peasantFarm = [];

var isGamePaused = false;
var currentIntervalId;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');    
  
  fowCanvas = document.createElement("canvas");
  fowCanvas.width = WORLD_SIZE_PIXELS_W;
  fowCanvas.height = WORLD_SIZE_PIXELS_H;
  fowCanvasContext = fowCanvas.getContext('2d');

  loadImages();
    
  canvas.addEventListener('mousemove', mousemoveHandler);
  
  canvas.addEventListener('mousedown', mousedownHandler);
  
  canvas.addEventListener('mouseup', mouseupHandler);

  initializeWorldGrid();

  populateTeam(playerUnits,PLAYER_PEASANT_START_UNITS,true, "peasant");
  populateTeam(playerUnits,PLAYER_WARRIOR_START_UNITS,true, "warrior");
  populateTeam(enemyUnits,ENEMY_GOBLIN_START_UNITS,false, "goblin");
  populateTeam(enemyUnits,ENEMY_ORC_START_UNITS,false, "orc");
  populateTeam(buildingUnits,PLAYER_START_BUILDING,true, "players hq");
  populateTeam(buildingUnits,ENEMY_START_BUILDING,true, "goblins hq");
  populateTeam(buildingUnits,ENEMY_START_ORC_BARRACK,true, "orc barrack");
  populateTeam(buildingUnits,ENEMY_START_FARMS,true, "orc farm");
  populateTeam(trees,STARTING_TREES,true, "trees");
  populateTeam(mines,STARTING_MINES,true, "mines");

  refreshCollisionGrid(); //needs to be called after populate, but before pathfinding
  SetupPathfindingGridData(playerUnits[0]);
  camera.x = playerUnits[0].x-canvas.width/2;
  camera.y = playerUnits[0].y-canvas.height/2;
}

/**
 * Use setInterval() to run the game in a loop at a specified frames per second.
 * Creating the interval timer provides a numeric, non-zero value ID, which gets
 * stored globally as a side effect.
 */
function runGameLoop() {
  var framesPerSecond = 30;

  currentIntervalId = setInterval(function() {
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond);
}

function imageLoadingDoneSoStartGame(){
  runGameLoop();

  document.addEventListener('keydown', keydownHandler);
}

function moveEverything() {
  for(var i=0;i<allUnits.length;i++) {
    allUnits[i].move();
  }
  removeDeadUnits();
  checkButtonHandling();
  checkAndHandleVictory(); 
  camera.update();
  refreshCollisionGrid();
}

function drawEverything() {
  
  canvasContext.save();
  canvasContext.translate(-camera.x,-camera.y);
  
  canvasContext.drawImage(backGroundPic,-100,-100); // offset so we can scroll a little bit past the top left corner of map

  var leftEdgeCol=Math.floor(camera.x/GRID_WIDTH);
  var topEdgeRow=Math.floor(camera.y/GRID_HEIGHT);
  var rightEdgeCol=Math.ceil((camera.x+canvas.width)/GRID_WIDTH);
  var bottomEdgeRow=Math.ceil((camera.y+canvas.height)/GRID_HEIGHT);
  for(var i = leftEdgeCol; i < rightEdgeCol; i++){
    for(var ii = topEdgeRow; ii < bottomEdgeRow; ii++){
      var unitListHere = worldGrid[colRowToIndex (i,ii)];
      if(unitListHere != null){
        unitListHere.sort(function(b, a){return a.y - b.y});
        for(var iii = 0; iii < unitListHere.length; iii++){
          unitListHere[iii].draw();
        }
      }
    }
  }

  for(var i=0;i<selectedUnits.length;i++) {
    selectedUnits[i].drawSelectionBox();
  }
  
  if(isMouseDragging) {
    coloredOutlineRectCornerToCorner(lassoX1,lassoY1, lassoX2,lassoY2, 'yellow');
  }

  //drawGridDebug();
  //drawPathingFindingTiles();  
  
  for(var i=0;i<playerUnits.length;i++) {
    playerUnits[i].debugDrawPath();
  }

  if(showWallToBuild){
    console.log("Show Wall To Build")
    drawBitmapCenteredAtLocationNoCameraCulling(wallPic, 32*3, 0,32,32, mouseX+camera.x,mouseY+camera.y);
  }

  if(showFarmToBuild){
    console.log("Show Farm to Build")
    drawBitmapCenteredAtLocationNoCameraCulling(orcFarmPic, 0, 50, 90,100, mouseX+camera.x, mouseY+camera.y);
  }

  if(showTowerToBuild){
    console.log("Show Tower to Build")
    drawBitmapCenteredAtLocationNoCameraCulling(towerPic, 0, 0, 90,100, mouseX+camera.x, mouseY+camera.y);
  }

  //drawFogOfWar();   //Turning off for now.  Fog of War when working eliminates the canvas to the background layer.
  fowCanvasContext.fillStyle = "red";
  fowCanvasContext.fillRect(10, 10, fowCanvas.width-20, fowCanvas.height-20);
  canvasContext.globalAlpha = 0.3;
  canvasContext.drawImage(fowCanvas,0,0); 
  canvasContext.globalAlpha = 1.0;

  canvasContext.restore(); // unshift camera pos

  drawUserInterface();
  drawMinimap();


  // the shadow around the edges
  canvasContext.drawImage(viewportShadows,-20,-40);
}

