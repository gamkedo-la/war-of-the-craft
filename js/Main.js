// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
const PLAYER_START_UNITS = 1;
const PLAYER_START_BUILDING = 1;
const ENEMY_GOBLIN_START_UNITS = 1;
const ENEMY_ORC_START_UNITS = 0;
const ENEMY_START_BUILDING = 1;
const STARTING_TREES = 1000;
const STARTING_MINES = 0;
var enemyUnits = [];
var playerUnits = [];
var buildingUnits = [];
var allUnits = [];
var trees = [];
var mines = []

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  loadImages();
    
  canvas.addEventListener('mousemove', mousemoveHandler);
  
  canvas.addEventListener('mousedown', mousedownHandler);
  
  canvas.addEventListener('mouseup', mouseupHandler);

  populateTeam(playerUnits,PLAYER_START_UNITS,true, "peasant");
  populateTeam(enemyUnits,ENEMY_GOBLIN_START_UNITS,false, "goblin");
  populateTeam(enemyUnits,ENEMY_ORC_START_UNITS,false, "orc");
  populateTeam(buildingUnits,PLAYER_START_BUILDING,true, "players hq");
  populateTeam(buildingUnits,ENEMY_START_BUILDING,true, "goblins hq");
  populateTeam(trees,STARTING_TREES,true, "trees");
  populateTeam(trees,STARTING_MINES,true, "mines");
}

function imageLoadingDoneSoStartGame(){
  var framesPerSecond = 30;

  setInterval(function() {
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond);
}

function moveEverything() {
  for(var i=0;i<allUnits.length;i++) {
    allUnits[i].move();
  }
  removeDeadUnits();
  checkAndHandleVictory(); 
}

function drawEverything() {
  canvasContext.drawImage(backGroundPic, 0,0); 
  
  for(var i=allUnits.length-1; i >=0;i--) {
    allUnits.sort(function(b, a){return a.y - b.y})
    allUnits[i].draw();
  }
  
  for(var i=0;i<selectedUnits.length;i++) {
    selectedUnits[i].drawSelectionBox();
  }
  
  if(isMouseDragging) {
    coloredOutlineRectCornerToCorner(lassoX1,lassoY1, lassoX2,lassoY2, 'yellow');
  }

  drawUserInterface();
}

function drawUserInterface(){
  drawBitmapCenteredAtLocation(lumberPic, 0,60, 60, 60, 40, 40);
  drawBitmapCenteredAtLocation(framePic, 0,0, 60, 60, 40, 40);

}