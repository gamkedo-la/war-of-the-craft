var constructionX = 10, constructionY = 120;
var lumberX = 10, lumberY = 200;
var attackX = 10, attackY = 300;
var goldX = 10, goldY = 380;
var farmX = 10, farmY = 480;
var wallX = 10, wallY = 120;
var farmBuildX = 10, farmBuildY = 200;
var peasantMainMenuX = 10, peasantMainMenuY = 300;
var pictureWidth = 60, pictureHeight = 60;

var peasantSelected = false, warriorSelected = false;
var peasantConstructionMenu = false, peasantMainMenu = true;
var uIButtonClicked = false;
var lumberButtonHovering = false, lumberButtonSelected = false;
var constructionButtonHovering = false, constructionButtonSelected = false;
var attackButtonHovering = false, attackButtonSelected = false;
var goldButtonHovering = false, goldButtonSelected = false;
var buildWallHovering = false, buildWallSelected = false;
var farmBuildHovering = false, farmBuildSelected = false;
var farmButtonHovering = false, farmButtonSelected = false, farmReadyToBePlaced = false;
var peasantReturnMenuHovering = false, peasantReturnMenuSelected = false;

var buttonDelayTicks = 1, buttonDelayTimer = false, startDelayTimer = false;
var showWallToBuild = false, showFarmToBuild = false, wallReadyToBePlace = false;

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
        uIButtonClicked = true;
        actionCallback();
    } else {
        buttonSelected = false;
        uIButtonClicked = false;
    }
}

function checkForPlayersSelected(){
  for(var i=0;i<playerUnits.length;i++) {
    if( playerUnits[i].isInBox(lassoX1,lassoY1,lassoX2,lassoY2) ) {
      selectedUnits.push(playerUnits[i]);
      if(selectedUnits[0].jobType == "peasant"){
        peasantSelected = true;
        warriorSelected = false;
      } else if (selectedUnits[0].jobType == "warrior"){
        peasantSelected = false;
        warriorSelected = true;
      } 
    }

    if(selectedUnits.length == 0){
      peasantSelected = false;
      warriorSelected = false;
    }
  }
}

// Various actions for units (lumber, attack, gold, farm)
function lumberAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    var nearestTreeFoundForPeasant = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_TREE_RANGE, trees, trees);
    selectedUnits[i].myTarget = nearestTreeFoundForPeasant;
    selectedUnits[i].actionSx = 0;
    selectedUnits[i].showAction = true;
    selectedUnits[i].gotoNear(selectedUnits[0].myTarget.x,selectedUnits[0].myTarget.y, 0, 1);
  }
  selectedUnits = [];
  checkForPlayersSelected();
}

function attackAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    selectedUnits[i].actionSx = 15 * 1;
    selectedUnits[i].showAction = true;
  }
  selectedUnits = [];
  checkForPlayersSelected();
}

function goldAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    var nearestMine = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_MINE_RANGE, mines, mines);
    selectedUnits[i].myTarget = nearestMine;
    selectedUnits[i].actionSx = 15 * 2;
    selectedUnits[i].showAction = true;
    selectedUnits[i].gotoNear(selectedUnits[0].myTarget.x,selectedUnits[0].myTarget.y, 0, 1);
  }
  selectedUnits = [];
  checkForPlayersSelected();
}

function farmAction() {
  for (var i = 0; i < selectedUnits.length; i++) {
    var nearestFarm = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_FARM_RANGE, buildingUnits, "peasant farm");
    selectedUnits[i].myTarget = nearestFarm;
    selectedUnits[i].actionSx = 15 * 3;
    selectedUnits[i].showAction = true;
    selectedUnits[i].gotoNear(selectedUnits[0].myTarget.x,selectedUnits[0].myTarget.y, 0, 1);
  }
  selectedUnits = [];
  checkForPlayersSelected();
}

// Construction-related actions
function constructionAction() {
  buttonDelayTicks = 60;
  startDelayTimer = true;
  buttonDelayTimer = false;
  peasantMainMenu = false;
  peasantConstructionMenu = true;
  for (var i = 0; i < selectedUnits.length; i++) {
    selectedUnits[i].actionSx = 15 * 4;
    selectedUnits[i].showAction = true;
  }
}

// Handle wall and farm construction placement
function showWall() {
  if(buttonDelayTimer){
    showWallToBuild = true;
    buttonDelayTicks = 10;
    startDelayTimer = true;
    buttonDelayTimer = false;
    buildWallSelected = false;
    peasantConstructionMenu = false;
    wallReadyToBePlace = true;
  }
}

function placeWall(){
  if(mouseClicked && buttonDelayTimer){
    populateTeam(buildingUnits,1,true, "wall");
    wallReadyToBePlace = false;
    buttonDelayTimer = false;
    showWallToBuild = false;
    peasantMainMenu = true;
    selectedUnits = [];
    checkForPlayersSelected();
  }

}

function displayFarmToBuild(){
  if(buttonDelayTimer){
    showFarmToBuild = true;
    buttonDelayTicks = 10;
    startDelayTimer = true;
    buttonDelayTimer = false;
    farmBuildSelected = false;
    peasantConstructionMenu = false;
    farmReadyToBePlaced = true;
    peasantMainMenu = false;
  }
}

function placeFarm() {
  if(buttonDelayTimer && mouseClicked){
    populateTeam(buildingUnits,1,true, "peasant farm");
    farmReadyToBePlaced = false;
    buttonDelayTimer = false;
    showFarmToBuild = false;
    peasantMainMenu = true;
    selectedUnits = [];
    checkForPlayersSelected();
  }
}

function returnToPeasantMainMenu(){
  peasantConstructionMenu = false;
  peasantMainMenu = true;
}

function checkButtonHandling(){
  if (peasantSelected && peasantMainMenu) {
    lumberButtonHovering = checkMouseInsideBox(lumberX, lumberY, pictureWidth, pictureHeight);
    attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
    goldButtonHovering = checkMouseInsideBox(goldX, goldY, pictureWidth, pictureHeight);
    farmButtonHovering = checkMouseInsideBox(farmX, farmY, pictureWidth, pictureHeight);
    farmBuildHovering = checkMouseInsideBox(farmBuildX, farmBuildY, pictureWidth, pictureHeight);
    constructionButtonHovering = checkMouseInsideBox(constructionX, constructionY, pictureWidth, pictureHeight);

    handleButtonClick(mouseClicked, lumberButtonHovering, lumberButtonSelected, lumberAction);
    //handleButtonClick(mouseClicked, attackButtonHovering, attackButtonSelected, attackAction);  
    handleButtonClick(mouseClicked, goldButtonHovering, goldButtonSelected, goldAction);
    handleButtonClick(mouseClicked, farmButtonHovering, farmButtonSelected, farmAction);
    handleButtonClick(mouseClicked, constructionButtonHovering, constructionButtonSelected, constructionAction);
  }

  if (peasantSelected && peasantConstructionMenu) {
    buildWallHovering = checkMouseInsideBox(wallX, wallY, pictureWidth, pictureHeight);
    farmBuildHovering = checkMouseInsideBox(farmBuildX, farmBuildY, pictureWidth, pictureHeight);
    peasantReturnMenuHovering = checkMouseInsideBox(peasantMainMenuX, peasantMainMenuY, pictureWidth, pictureHeight);

    handleButtonClick(mouseClicked, buildWallHovering, buildWallSelected, showWall);
    handleButtonClick(mouseClicked, farmBuildHovering, farmBuildSelected, displayFarmToBuild);
    handleButtonClick(mouseClicked, peasantReturnMenuHovering, peasantReturnMenuSelected, returnToPeasantMainMenu);
  }

  if(wallReadyToBePlace){
    placeWall();
  }

  if(farmReadyToBePlaced){
    placeFarm();
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

  drawAssignmentsGUI();

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

  if (peasantSelected && peasantConstructionMenu) {
    drawBitmapAtLocation(userInterfacePic, 0, 120, pictureWidth, pictureHeight, 10, 36);
    colorText("PEASANT", 9, 20, "Yellow", "14px Arial");
    colorText("OPTIONS", 9, 116, "Yellow", "14px Arial");

    drawButton(wallX, wallY, userInterfacePic, 420, "BUILD", "WALL", buildWallHovering, buildWallSelected);
    drawButton(farmBuildX, farmBuildY, userInterfacePic, 480, "BUILD", "FARM", farmBuildHovering, farmBuildSelected);
    drawButton(peasantMainMenuX, peasantMainMenuY, userInterfacePic, 540, "BACK TO", "MAIN MENU", peasantReturnMenuHovering, peasantReturnMenuSelected);
  }
}

// an area on the right side of the screen
// for quests and battle assignments
function drawAssignmentsGUI() {
    const tx = 500;
    const ty = 400;
    const th = 14;
    const rgb = "white";
    const fnt = "14px Arial";
    let lines = 0;
    
    //drawBitmapAtLocation(assignmentsGUIPic, 0, 120, pictureWidth, pictureHeight, 10, 36);
    colorText("ASSIGNMENTS:",tx+1,ty+(lines*th)+1,"black",fnt);
    colorText("ASSIGNMENTS:",tx,ty+(lines++*th),rgb,fnt);
    colorText("Chop 15 wood",tx,ty+(lines++*th),rgb,fnt);
    colorText("Mine 25 gold",tx,ty+(lines++*th),rgb,fnt);
    colorText("Build 2 farms",tx,ty+(lines++*th),rgb,fnt);
    colorText("Win 10 battles",tx,ty+(lines++*th),rgb,fnt);
}