// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
const PLAYER_PEASANT_START_UNITS = 10;
const PLAYER_WARRIOR_START_UNITS = 10;
const PLAYER_START_BUILDING = 1;
const ENEMY_GOBLIN_START_UNITS = 10;
const ENEMY_ORC_START_UNITS = 2;
const ENEMY_START_BUILDING = 1;
const ENEMY_START_FARMS = 1;
const ENEMY_START_ORC_BARRACK = 1;
const PLAYER_START_FARMS = 1;
const STARTING_TREES = 7000;
const STARTING_MINES = 5;

var enemyUnits = [];
var playerUnits = [];
var buildingUnits = [];
var allUnits = [];
var trees = [];
var mines = [];

var isGamePaused = false;
var currentIntervalId;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

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
  populateTeam(buildingUnits,PLAYER_START_BUILDING,true, "melon");
  populateTeam(buildingUnits,ENEMY_START_BUILDING,true, "goblins hq");
  populateTeam(buildingUnits,ENEMY_START_ORC_BARRACK,true, "orc barrack");
  populateTeam(buildingUnits,ENEMY_START_FARMS,true, "orc farm");
  populateTeam(buildingUnits,PLAYER_START_FARMS,true, "peasant farm");
  populateTeam(trees,STARTING_TREES,true, "trees");
  populateTeam(mines,STARTING_MINES,true, "mine");
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

  if(showWallToBuild){
    drawBitmapCenteredAtLocation(minePic, 32*3, 0,32,32, mouseX,mouseY)
  }

  drawGridDebug();
  
  canvasContext.restore(); // unshift camera pos

  drawUserInterface();

  // the shadow around the edges
  canvasContext.drawImage(viewportShadows,-20,-40);
}

