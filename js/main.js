// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext, fowCanvas, fowCanvasContext, unexploredCanvas, unexploredCanvasContext;
const PLAYER_PEASANT_START_UNITS = 1;
const PLAYER_WARRIOR_START_UNITS = 0;
const PLAYER_START_BUILDING = 1;
const ENEMY_GOBLIN_START_UNITS = 5;
const ENEMY_ORC_START_UNITS = 5;
const ENEMY_START_BUILDING = 1;
const ENEMY_START_FARMS = 0;
const ENEMY_START_ORC_BARRACK = 0;
const PLAYER_START_FARMS = 0;
const STARTING_TREES = 500;
const STARTING_MINES = 2;

var enemyUnits = [];
var playerUnits = [];
var buildingUnits = [];
var allUnits = [];
var trees = [];
var mines = [];
var peasantFarm = [];
var enemyAIManager = new enemyAITeamClass();

var isGamePaused = false;
var currentIntervalId;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');    
  
  fowCanvas = document.createElement("canvas");
  fowCanvas.width = WORLD_SIZE_WITH_SHORELINE_PIXELS_W;
  fowCanvas.height = WORLD_SIZE_WITH_SHORELINE_PIXELS_H;
  fowCanvasContext = fowCanvas.getContext('2d');

  unexploredCanvas = document.createElement("canvas");
  unexploredCanvas.width = WORLD_SIZE_WITH_SHORELINE_PIXELS_W;
  unexploredCanvas.height = WORLD_SIZE_WITH_SHORELINE_PIXELS_H;
  unexploredCanvasContext = unexploredCanvas.getContext('2d');

  unexploredCanvasContext.fillStyle = "black";
  unexploredCanvasContext.fillRect(0, 0, unexploredCanvas.width, unexploredCanvas.height);

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
  enemyAIManager.setup();

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

  elapsedTime += timestamp;

  /*if (elapsedTime < 0) {
      // Draw startup screen for the first 15 seconds
      drawMainMenu();
  } else if (!isGameRunning) {
      // Perform panning transition
      transitionToGame(timestamp);
      drawEverything();
  } else { */
 //   requestAnimationFrame(gameLoop);

    currentIntervalId = setInterval(function() {
        moveEverything();
        drawEverything();
      }, 1000/framesPerSecond);
  //}
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
  enemyAIManager.update();
  checkAndHandleVictory(); 
  camera.update();
  refreshCollisionGrid();
}

function drawEverything() {
  
  canvasContext.save();
  canvasContext.translate(-camera.x,-camera.y);
  
  canvasContext.drawImage(backGroundPic,-SIZE_OF_THE_SHORE,-SIZE_OF_THE_SHORE); // offset so we can scroll a little bit past the top left corner of map
  wildflowers.draw(); // random flowers, grass and rocks

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
          if(unitListHere[iii].render != false){ //Also catches undefined
            unitListHere[iii].draw();
          }
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
    drawBitmapCenteredAtLocationNoCameraCulling(wallPic, 32*3, 0,32,32, mouseX+camera.x,mouseY+camera.y);
  }

  if(showFarmToBuild){
    drawBitmapCenteredAtLocationNoCameraCulling(orcFarmPic, 0, 180, 100, 60, mouseX+camera.x, mouseY+camera.y);
  }

  if(showTowerToBuild){
    drawBitmapCenteredAtLocationNoCameraCulling(towerPic, 0, 270,100,90, mouseX+camera.x, mouseY+camera.y);
  }

  drawFogOfWar();   //Turning off for now.  Fog of War when working eliminates the canvas to the background layer.

  canvasContext.globalAlpha = 0.3;
  canvasContext.drawImage(fowCanvas,-SIZE_OF_THE_SHORE,-SIZE_OF_THE_SHORE); 
  canvasContext.globalAlpha = 1.0;
  canvasContext.drawImage(unexploredCanvas,-SIZE_OF_THE_SHORE,-SIZE_OF_THE_SHORE); 

  canvasContext.restore(); // unshift camera pos

  drawUserInterface();
  drawMinimap();
  
  // the shadow around the edges
  canvasContext.drawImage(viewportShadows,-20,-40);
}

