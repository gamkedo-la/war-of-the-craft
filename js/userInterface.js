var constructionX = 10, constructionY = 120;
var lumberX = 10, lumberY = 200;
var attackX = 10, attackY = 300;
var goldX = 10, goldY = 380;
var farmX = 10, farmY = 480;
var wallX = 10, wallY = 120;
var farmBuildX = 10, farmBuildY = 200;
var peasantMainMenuX = 10, peasantMainMenuY = 400;
var pictureWidth = 60, pictureHeight = 60;
var towerX = 10, towerY = 300;

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
var towerButtonHovering = false, towerButtonSelected = false, towerReadyToBePlaced = false;
var peasantReturnMenuHovering = false, peasantReturnMenuSelected = false;

var showTowerToBuild = false, showWallToBuild = false, showFarmToBuild = false;

var headQuartersUI = false;

var buttonDelayTicks = 1, buttonDelayTimer = false, startDelayTimer = false;
var showWallToBuild = false, showFarmToBuild = false, wallReadyToBePlace = false;
recruitPeasantBoxHovering = false, recruitPeasantSelected = false, recruitPeasantX = 10, recruitPeasantY = 180;
recruitWarriorBoxHovering = false, recruitWarriorSelected = false, recruitWarriorX = 10, recruitWarriorY = 280;

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
      headQuartersUI = false;
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
    selectedUnits[i].focus = "trees";
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
    if (nearestMine) {
        selectedUnits[i].myTarget = nearestMine;
        selectedUnits[i].actionSx = 15 * 2;
        selectedUnits[i].showAction = true;
        selectedUnits[i].gotoNear(nearestMine.x,nearestMine.y, 0, 1);
        selectedUnits[i].focus = "mines";
    } else {
        console.log("goldAction: unit was unable to find a nearby mine");
    }
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
    var newUnit = buildingUnits.length-1;
    buildingUnits[newUnit].x = mouseX + camera.x; 
    buildingUnits[newUnit].y = mouseY + camera.y;
    wallReadyToBePlace = false;
    buttonDelayTimer = false;
    showWallToBuild = false;
    peasantMainMenu = true;
    selectedUnits = [];
    checkForPlayersSelected();
  }
}

function displayFarmToBuild(){
  showFarmToBuild = true;
  buttonDelayTicks = 10;
  startDelayTimer = true;
  buttonDelayTimer = false;
  farmBuildSelected = false;
  peasantConstructionMenu = false;
  farmReadyToBePlaced = true;
  peasantMainMenu = false;
}

function placeFarm() {
  if(buttonDelayTimer && mouseClicked){
    console.log("UI Place Farm")
    populateTeam(buildingUnits,1,true, "peasant farm");
    farmReadyToBePlaced = false;
    buttonDelayTimer = false;
    showFarmToBuild = false;
    peasantMainMenu = true;
    selectedUnits = [];
    checkForPlayersSelected();
    assignmentTotals.farmsBuilt++; // add to stats totals. FIXME: is this the best place for this?
  }
}

function displayTowerToBuild(){
  console.log("Dispay Tower")
  if(buttonDelayTimer){
    showTowerToBuild = true;
    buttonDelayTicks = 10;
    startDelayTimer = true;
    buttonDelayTimer = false;
    towerBuildSelected = false;
    peasantConstructionMenu = false;
    towerReadyToBePlaced = true;
    peasantMainMenu = false;
    console.log("Farm: " + farmReadyToBePlaced + " Tower: " + towerReadyToBePlaced)
  }
}

function placeTower() {
  if(buttonDelayTimer && mouseClicked){
    populateTeam(buildingUnits,1,true, "tower");
    var currentBuilding = buildingUnits.length-1;
    buildingUnits[currentBuilding].buildingInProgress = true;
    towerReadyToBePlaced = false;
    buttonDelayTimer = false;
    showTowerToBuild = false;
    peasantMainMenu = true;
    selectedUnits = [];
    checkForPlayersSelected();
    assignmentTotals.towersBuilt++; // add to stats totals. FIXME: is this the best place for this?
  }
}

function returnToPeasantMainMenu(){
  peasantConstructionMenu = false;
  peasantMainMenu = true;
}

function recruitPeasant(){
  headQuartersUI = false;
  populateTeam(playerUnits, 1, true, "peasant");
  var newUnit = playerUnits.length-1;
  playerUnits[newUnit].x = buildingUnits[0].x;
  playerUnits[newUnit].y = buildingUnits[0].y;
  var nearestTreeFound = findClosestUnitInRange(playerUnits[newUnit].x, playerUnits[newUnit].y, UNIT_AI_TREE_RANGE, trees, null);
  playerUnits[newUnit].myTarget = nearestTreeFound;
  playerUnits[newUnit].focus = 'trees';
}

function recruitWarrior(){
  headQuartersUI = false;
  populateTeam(playerUnits, 1, true, "warrior");
  var newUnit = playerUnits.length-1;
  playerUnits[newUnit].x = buildingUnits[0].x;
  playerUnits[newUnit].y = buildingUnits[0].y;
  var keepAtHQ = findClosestUnitInRange(playerUnits[newUnit].x,playerUnits[newUnit].y,5600, buildingUnits);
  playerUnits[newUnit].myTarget = keepAtHQ;
  playerUnits[newUnit].focus = 'trees'; //change to patrol when available
}

function patrolArea(){
  for (var i = 0; i < selectedUnits.length; i++) {
    selectedUnits[i].actionSx = 15 * 1;
    selectedUnits[i].showAction = true;
  }
}

function checkButtonHandling(){
  if (peasantSelected && peasantMainMenu) {
    lumberButtonHovering = checkMouseInsideBox(lumberX, lumberY, pictureWidth, pictureHeight);
    attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
    goldButtonHovering = checkMouseInsideBox(goldX, goldY, pictureWidth, pictureHeight);
    farmButtonHovering = checkMouseInsideBox(farmX, farmY, pictureWidth, pictureHeight);
    farmBuildHovering = checkMouseInsideBox(farmBuildX, farmBuildY, pictureWidth, pictureHeight);
    constructionButtonHovering = checkMouseInsideBox(constructionX, constructionY, pictureWidth, pictureHeight);
    recruitPeasantBoxHovering = checkMouseInsideBox(recruitPeasantX, recruitPeasantY, pictureWidth, pictureHeight);
    recruitWarriorBoxHovering = checkMouseInsideBox(recruitWarriorX, recruitWarriorY, pictureWidth, pictureHeight);

    handleButtonClick(mouseClicked, lumberButtonHovering, lumberButtonSelected, lumberAction);
    //handleButtonClick(mouseClicked, attackButtonHovering, attackButtonSelected, attackAction);  
    handleButtonClick(mouseClicked, goldButtonHovering, goldButtonSelected, goldAction);
    handleButtonClick(mouseClicked, farmButtonHovering, farmButtonSelected, farmAction);
    handleButtonClick(mouseClicked, constructionButtonHovering, constructionButtonSelected, constructionAction);
  }

  if (peasantSelected && peasantConstructionMenu) {
    buildWallHovering = checkMouseInsideBox(wallX, wallY, pictureWidth, pictureHeight);
    farmBuildHovering = checkMouseInsideBox(farmBuildX, farmBuildY, pictureWidth, pictureHeight);
    towerButtonHovering = checkMouseInsideBox(towerX, towerY, pictureWidth, pictureHeight);
    peasantReturnMenuHovering = checkMouseInsideBox(peasantMainMenuX, peasantMainMenuY, pictureWidth, pictureHeight);

    handleButtonClick(mouseClicked, buildWallHovering, buildWallSelected, showWall);
    handleButtonClick(mouseClicked, farmBuildHovering, farmBuildSelected, displayFarmToBuild); 
    handleButtonClick(mouseClicked, peasantReturnMenuHovering, peasantReturnMenuSelected, returnToPeasantMainMenu);
    handleButtonClick(mouseClicked, towerButtonHovering, towerButtonSelected, displayTowerToBuild);
    console.log(buildWallHovering,farmBuildHovering, towerButtonHovering, peasantReturnMenuHovering)
  }

  if(wallReadyToBePlace){
    placeWall();
  }

  if(farmReadyToBePlaced){
    placeFarm();
  }

  if(towerReadyToBePlaced){
    placeTower();
  }

  if(headQuartersUI){
    recruitPeasantBoxHovering = checkMouseInsideBox(recruitPeasantX, recruitPeasantY, pictureWidth, pictureHeight);
    recruitWarriorBoxHovering = checkMouseInsideBox(recruitWarriorX, recruitWarriorY, pictureWidth, pictureHeight);

    handleButtonClick(mouseClicked, recruitPeasantBoxHovering, recruitPeasantSelected, recruitPeasant);
    handleButtonClick(mouseClicked, recruitWarriorBoxHovering, recruitWarriorSelected, recruitWarrior);
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
    if(buildWallHovering){
      colorText("Wood: 10", wallX+70, wallY+30, "white", "14px Arial");
    } 
    drawButton(farmBuildX, farmBuildY, userInterfacePic, 480, "BUILD", "FARM", farmBuildHovering, farmBuildSelected);
    if(farmBuildHovering){
      colorText("Wood: 300", farmBuildX+70, farmBuildY+30, "white", "14px Arial");
    }
    drawButton(towerX, towerY, userInterfacePic, 720, "BUILD", "TOWER", towerButtonHovering, towerButtonSelected);
    if(towerButtonHovering){
      colorText("Wood: 300", towerX+70, towerY+30, "white", "14px Arial");
    }
    drawButton(peasantMainMenuX, peasantMainMenuY, userInterfacePic, 540, "BACK TO", "MAIN MENU", peasantReturnMenuHovering, peasantReturnMenuSelected);
  }

  if(headQuartersUI){
    colorRect(10, 36, 100, 100, "AQUA");
    drawBitmapAtLocation(humanHQPic, 0, 0, 100, 100, 10, 36);
    colorText("RECRUITING", 19, 30, "Yellow", "14px Arial");
    colorText("OPTIONS", 26, 150, "Yellow", "14px Arial");

    drawButton(recruitPeasantX, recruitPeasantY, userInterfacePic, 600, "RECRUIT", "PEASANT", recruitPeasantBoxHovering, recruitPeasant);
      if(recruitPeasantBoxHovering){
        colorText("Food: 100", recruitPeasantX+70, recruitPeasantY+30, "white", "14px Arial");
      } 
    drawButton(recruitWarriorX, recruitWarriorY, userInterfacePic, 660, "RECRUIT", "WARRIOR", recruitWarriorBoxHovering, recruitWarrior);
      if(recruitWarriorBoxHovering){
        colorText("Food: 300", recruitWarriorX+70, recruitWarriorY+30, "white", "14px Arial");
      } 
  }
}