var constructionX = 10, constructionY = 120;
var lumberX = 10, lumberY = 200;
var attackX = 10, attackY = 300;
var goldX = 10, goldY = 380;
var farmX = 10, farmY = 480;
var wallX = 10, wallY = 120;
var farmBuildX = 10, farmBuildY = 200;
var pictureWidth = 60, pictureHeight = 60;

var peasantSelected = false, warriorSelected = false;
var peasantConstructionMenu = false, peasantMainMenu = true;

var lumberButtonHovering = false, lumberButtonSelected = false;
var constructionButtonHovering = false, constructionButtonSelected = false;
var attackButtonHovering = false, attackButtonSelected = false;
var goldButtonHovering = false, goldButtonSelected = false;
var buildWallHovering = false, buildWallSelected = false;
var farmBuildHovering = false, farmBuildSelected = false;
var farmButtonHovering = false, farmButtonSelected = false;

var buttonDelayTicks = 10, buttonDelayTimer = false, startDelayTimer = false;
var showWallToBuild = false, showFarmToBuild = false;

// Check if mouse is inside a given box
function checkMouseInsideBox(xPos, yPos, width, height) {
    var x1 = Math.floor(xPos), y1 = Math.floor(yPos);
    var x2 = x1 + width, y2 = y1 + height;
    return (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2);
}

// Handle button click actions
function handleButtonClick(mouseClicked, buttonHovering, buttonSelected, actionCallback) {
    if (mouseClicked && buttonHovering) {
        buttonSelected = true;
        actionCallback();
    } else {
        buttonSelected = false;
    }
}

// Various actions for units (lumber, attack, gold, farm)
function lumberAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    var nearestTree = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_TREE_RANGE, trees, null);
    selectedUnits[i].myTarget = nearestTree;
    selectedUnits[i].actionSx = 0;
    selectedUnits[i].showAction = true;
  }
}

function attackAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    selectedUnits[i].actionSx = 15 * 1;
    selectedUnits[i].showAction = true;
  }
}

function goldAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    var nearestMine = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_MINE_RANGE, mines, null);
    selectedUnits[i].myTarget = nearestMine;
    selectedUnits[i].actionSx = 15 * 2;
    selectedUnits[i].showAction = true;
  }
}

function farmAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    var nearestFarm = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_FARM_RANGE, buildingUnits, "peasant farm");
    selectedUnits[i].myTarget = nearestFarm;
    selectedUnits[i].actionSx = 15 * 3;
    selectedUnits[i].showAction = true;
  }
}

// Construction-related actions
function constructionAction() {
  buttonDelayTicks = 60;
  startDelayTimer = true;
  buttonDelayTimer = false;
  for (var i = 0; i < selectedUnits.length; i++) {
    selectedUnits[i].actionSx = 15 * 4;
    selectedUnits[i].showAction = true;
  }
}

// Handle wall and farm construction placement
function placeWall() {
  if (peasantSelected && buildWallSelected) {
    showWallToBuild = true;
    buttonDelayTicks = 10;
    startDelayTimer = true;
    buttonDelayTimer = true;
    buildWallSelected = false;
  }
}

function placeFarm() {
  if (peasantSelected && farmBuildSelected) {
    showFarmToBuild = true;
    buttonDelayTicks = 10;
    startDelayTimer = true;
    buttonDelayTimer = true;
    farmBuildSelected = false;
  }
}

function checkButtonHandling(){
  if (peasantSelected && peasantMainMenu) {
    lumberButtonHovering = checkMouseInsideBox(lumberX, lumberY, pictureWidth, pictureHeight);
    attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
    goldButtonHovering = checkMouseInsideBox(goldX, goldY, pictureWidth, pictureHeight);
    farmBuildHovering = checkMouseInsideBox(farmX, farmY, pictureWidth, pictureHeight);
    constructionButtonHovering = checkMouseInsideBox(constructionX, constructionY, pictureWidth, pictureHeight);

    handleButtonClick(mouseClicked, lumberButtonHovering, lumberButtonSelected, lumberAction);
    handleButtonClick(mouseClicked, attackButtonHovering, attackButtonSelected, attackAction);  
    handleButtonClick(mouseClicked, goldButtonHovering, goldButtonSelected, goldAction);
    handleButtonClick(mouseClicked, farmButtonHovering, farmButtonSelected, farmAction);
    handleButtonClick(mouseClicked, constructionButtonHovering, constructionButtonSelected, constructionAction);
  }
}

function drawButton(x, y, image, sY,text1, text2, hovering, selected) {
  if (hovering && mouseClicked) {
    drawBitmapAtLocation(image, 60, sY, pictureWidth, pictureHeight, x, y);
  } else {
    drawBitmapAtLocation(image, 0, sY, pictureWidth, pictureHeight, x, y);
  }
  
  colorText(text1, 9, y + pictureHeight + 15, hovering ? "Yellow" : "White", "14px Arial");
  if (text2) {
    colorText(text2, 9, y + pictureHeight + 29, hovering ? "Yellow" : "White", "14px Arial");
  }
}

// Main UI loop
function drawUserInterface() {
  if (startDelayTimer) {
    buttonDelayTicks--;
    if (buttonDelayTicks <= 0) {
      buttonDelayTimer = true;
      startDelayTimer = false;
    }
  }

  //indicator top of screen
  if (peasantSelected || warriorSelected) {
    drawBitmapAtLocation(peasantPic, 0, 60, 15, 15, 100, 10);
    drawBitmapAtLocation(warriorPic, 0, 60, 20, 20, 160, 8);
    colorText(" = " + playerUnits.length, 120, 22, "White", "14px Arial");
    colorText(" = " + playerUnits.length, 180, 22, "White", "14px Arial");
  }

  //left side interface
  if (peasantSelected && peasantMainMenu) {
    drawBitmapAtLocation(userInterfacePic, 0, 120, pictureWidth, pictureHeight, 10, 36);
    colorText("PEASANT", 9, 20, "Yellow", "14px Arial");
    colorText("OPTIONS", 9, 116, "Yellow", "14px Arial");

    drawButton(lumberX, lumberY, userInterfacePic, 60, "GATHER", "LUMBER", lumberButtonHovering, lumberButtonSelected);
    drawButton(constructionX, constructionY, userInterfacePic, 360, "BUILD", null, constructionButtonHovering, constructionButtonSelected);
    drawButton(attackX, attackY, userInterfacePic, 180, "ATTACK", null, attackButtonHovering, attackButtonSelected);
    drawButton(goldX, goldY, userInterfacePic, 240, "MINE", "GOLD", goldButtonHovering, goldButtonSelected);
    drawButton(farmX, farmY, userInterfacePic, 300, "FARM", "FOOD", farmButtonHovering, farmButtonSelected);
  }
}
