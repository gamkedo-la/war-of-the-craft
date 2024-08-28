// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
const PLAYER_START_UNITS = 10;
const PLAYER_START_BUILDING = 1;
const ENEMY_GOBLIN_START_UNITS = 10;
const ENEMY_ORC_START_UNITS = 1;
const ENEMY_START_BUILDING = 1;
const STARTING_TREES = 100;
const STARTING_MINES = 0;
var enemyUnits = [];
var playerUnits = [];
var buildingUnits = [];
var allUnits = [];
var trees = [];
var mines = [];

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
var goldX = 10;
var goldY = 380;
var goldButtonHovering = false;
var goldButtonSelected = false;
var farmX = 10;
var farmY = 480;
var goldButtonHovering = false;
var goldButtonSelected = false;

var isGamePaused = false;
var currentIntervalId;


const GRID_ROWS = 100;
const GRID_COLUMNS = 100;
const GRID_WIDTH = 32;
const GRID_HEIGHT = 32;
const WORLD_SIZE_PIXELS_W = GRID_ROWS * GRID_WIDTH;
const WORLD_SIZE_PIXELS_H = GRID_COLUMNS * GRID_HEIGHT;
var showGrid = true;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  loadImages();
    
  canvas.addEventListener('mousemove', mousemoveHandler);
  
  canvas.addEventListener('mousedown', mousedownHandler);
  
  canvas.addEventListener('mouseup', mouseupHandler);

  initializeWorldGrid();

  populateTeam(playerUnits,PLAYER_START_UNITS,true, "peasant");
  populateTeam(enemyUnits,ENEMY_GOBLIN_START_UNITS,false, "goblin");
  populateTeam(enemyUnits,ENEMY_ORC_START_UNITS,false, "orc");
  populateTeam(buildingUnits,PLAYER_START_BUILDING,true, "players hq");
  populateTeam(buildingUnits,ENEMY_START_BUILDING,true, "goblins hq");
  populateTeam(trees,STARTING_TREES,true, "trees");
  populateTeam(trees,STARTING_MINES,true, "mines");
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
  goldButtonHovering = checkMouseInsideBox(goldX, goldY, pictureWidth, pictureHeight);
  farmButtonHovering = checkMouseInsideBox(farmX, farmY, pictureWidth, pictureHeight);
  if(mouseClicked && lumberButtonHovering){
    lumberButtonSelected = true;
    for(var i=0;i<selectedUnits.length;i++) {
      nearestTreeFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_TREE_RANGE, trees);
      selectedUnits[i].myTarget = nearestTreeFound;
      selectedUnits[i].action[0];
      selectedUnits[i].showAction = true;
    } 
  } else {
    lumberButtonSelected = false;
  }
  if(mouseClicked && attackButtonHovering){
    attackButtonSelected = true;
  } else {
    attackButtonSelected = false;
  }
  if(mouseClicked && goldButtonHovering){
    goldButtonSelected = true;
  } else {
    goldButtonSelected = false;
  }
  if(mouseClicked && farmButtonHovering){
    farmButtonSelected = true;
  } else {
    farmButtonSelected = false;
  }
}

function drawEverything() {
  
  canvasContext.save();
  canvasContext.translate(-camera.x,-camera.y);
  
  canvasContext.drawImage(backGroundPic, -800,-600); // offset so we can scroll a little bit past the top left corner of map
  
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

  drawGridDebug();
  
  canvasContext.restore(); // unshift camera pos

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
  //gold mining
  if(goldButtonHovering && mouseClicked){ //picture
    drawBitmapAtLocation(lumberPic, 60,240, pictureWidth, pictureHeight, goldX, goldY);
  } else {
    drawBitmapAtLocation(lumberPic, 0,240, pictureWidth, pictureHeight, goldX, goldY);
  }
  if(goldButtonHovering){ //frame
    drawBitmapAtLocation(framePic, 60,0, pictureWidth, pictureHeight, goldX, goldY);
    colorText("MINE", 19, goldY+pictureHeight+15, "Yellow", "14px Arial");
    colorText("GOLD", 18, goldY+pictureHeight+29, "Yellow", "14px Arial");
  } else {
    drawBitmapAtLocation(framePic, 0,0, pictureWidth, pictureHeight, goldX, goldY);
    colorText("MINE", 19, goldY+pictureHeight+15, "Black", "14px Arial");
    colorText("GOLD", 18, goldY+pictureHeight+29, "Black", "14px Arial");
  }
  if(goldButtonHovering && mouseClicked){ //text
    colorText("MINE", 19, goldY+pictureHeight+15, "White", "14px Arial");
    colorText("GOLD", 18, goldY+pictureHeight+29, "White", "14px Arial");
  }  
  //farming
  if(farmButtonHovering && mouseClicked){ //picture
    drawBitmapAtLocation(lumberPic, 60,300, pictureWidth, pictureHeight, farmX, farmY);
  } else {
    drawBitmapAtLocation(lumberPic, 0,300, pictureWidth, pictureHeight, farmX, farmY);
  }
  if(farmButtonHovering){ //frame
    drawBitmapAtLocation(framePic, 60,0, pictureWidth, pictureHeight, farmX, farmY);
    colorText("FARM", 19, farmY+pictureHeight+15, "Yellow", "14px Arial");
    colorText("FOOD", 18, farmY+pictureHeight+29, "Yellow", "14px Arial");
  } else {
    drawBitmapAtLocation(framePic, 0,0, pictureWidth, pictureHeight, farmX, farmY);
    colorText("FARM", 19, farmY+pictureHeight+15, "Black", "14px Arial");
    colorText("FOOD", 18, farmY+pictureHeight+29, "Black", "14px Arial");
  }
  if(farmButtonHovering && mouseClicked){ //text
    colorText("FARM", 19, farmY+pictureHeight+15, "White", "14px Arial");
    colorText("FOOD", 18, farmY+pictureHeight+29, "White", "14px Arial");
  }  
}