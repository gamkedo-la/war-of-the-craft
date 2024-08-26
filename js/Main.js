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

var lumberX = 10;
var lumberY = 200;
var pictureWidth = 60;
var pictureHeight = 60;
var lumberButtonHovering = false;
var lumberButtonSelected = false;
var attackX = 10;
var attackY = 300;
var attackButtonHovering = false;
var attackButtonSelected = false;

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
  checkButtonHandling();
  checkAndHandleVictory(); 
}

function checkMouseInsideBox(xPos, yPos, width, height){
  var x1 = Math.floor(xPos);
  var y1 = Math.floor(yPos);
  var x2 = x1 + width;
  var y2 = y1 + height
  if(mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2){
    return true;
  } else {
    return false;
  }
}


function checkButtonHandling(){
  lumberButtonHovering = checkMouseInsideBox(lumberX, lumberY, pictureWidth, pictureHeight);    
  attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
  if(mouseClicked && lumberButtonHovering){
    lumberButtonSelected = true;
  } else {
    lumberButtonSelected = false;
  }
  if(mouseClicked && attackButtonHovering){
    attackButtonSelected = true;
  } else {
    attackButtonSelected = false;
  }
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
  drawBitmapAtLocation(userInterfaceBackgroundPic, 0, 0, 800, 600, 0, 0);
  drawBitmapAtLocation(peasantProfilePic, 0,120, pictureWidth, pictureHeight, 10, 100);
  colorText("PEASANT", 9, 95, "Yellow", "14px Arial");
  colorText("OPTIONS", 9, 180, "Black", "14px Arial");
  //lumber
  if(lumberButtonHovering && mouseClicked){ //picture
    drawBitmapAtLocation(lumberPic, 60,60, pictureWidth, pictureHeight, lumberX, lumberY);
  } else {
    drawBitmapAtLocation(lumberPic, 0,60, pictureWidth, pictureHeight, lumberX, lumberY);
  }
  if(lumberButtonHovering){ //frame
    drawBitmapAtLocation(framePic, 60,0, pictureWidth, pictureHeight, lumberX, lumberY);
    colorText("GATHER", 9, lumberY+pictureHeight+15, "Yellow", "14px Arial");
    colorText("LUMBER", 9, lumberY+pictureHeight+29, "Yellow", "14px Arial");
  } else {
    drawBitmapAtLocation(framePic, 0,0, pictureWidth, pictureHeight, lumberX, lumberY);
    colorText("GATHER", 9, lumberY+pictureHeight+15, "Black", "14px Arial");
    colorText("LUMBER", 9, lumberY+pictureHeight+29, "Black", "14px Arial");
  }
  if(lumberButtonHovering && mouseClicked){ //text
    colorText("GATHER", 9, lumberY+pictureHeight+15, "White", "14px Arial");
    colorText("LUMBER", 9, lumberY+pictureHeight+29, "White", "14px Arial");
  }
  //attacking
  if(attackButtonHovering && mouseClicked){ //picture
    drawBitmapAtLocation(lumberPic, 60,180, pictureWidth, pictureHeight, attackX, attackY);
  } else {
    drawBitmapAtLocation(lumberPic, 0,180, pictureWidth, pictureHeight, attackX, attackY);
  }
  if(attackButtonHovering){ //frame
    drawBitmapAtLocation(framePic, 60,0, pictureWidth, pictureHeight, attackX, attackY);
    colorText("ATTACK", 11, attackY+pictureHeight+15, "Yellow", "14px Arial");
  } else {
    drawBitmapAtLocation(framePic, 0,0, pictureWidth, pictureHeight, attackX, attackY);
    colorText("ATTACK", 11, attackY+pictureHeight+15, "Black", "14px Arial");
  }
  if(attackButtonHovering && mouseClicked){ //text
    colorText("ATTACK", 11, attackY+pictureHeight+15, "White", "14px Arial");
  }  
}