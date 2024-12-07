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

var foodConsumed = 0;
var foodAvailable = 0;
var woodConsumed = 0;
var woodAvailable = 0;
var goldConsumed = 0;
var goldAvailable = 0;

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
        actionCallback(selectedUnits);
        checkForPlayersSelected();
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
        peasantSelectedSound.play();
      } else if (selectedUnits[0].jobType == "warrior"){
        peasantSelected = false;
        warriorSelected = true;
        warriorSelectedSound.play();
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
function lumberAction(actionList) {
  for (var i = 0; i < actionList.length; i++) {
    var nearestTreeFoundForPeasant = findClosestUnitInRange(actionList[i].x, actionList[i].y, UNIT_AI_TREE_RANGE, trees, trees);
    actionList[i].myTarget = nearestTreeFoundForPeasant;
    actionList[i].actionSx = 0;
    actionList[i].showAction = true;
    actionList[i].gotoNear(actionList[0].myTarget.x,actionList[0].myTarget.y, 0, 1);
    actionList[i].focus = "trees";
    var goalTile = pixelCoordToIndex(actionList[i].myTarget.x, actionList[i].myTarget.y);
    startPath(goalTile, actionList[i]);
    console.log("Lumber Action "+i+" of "+actionList.length+" generated a path to a nearby tree at "+Math.round(nearestTreeFoundForPeasant.x)+","+Math.round(nearestTreeFoundForPeasant.y));
  }
  actionList.splice(0,actionList.length); //empties original array
}

function attackAction(actionList) { //not called
  for (var i = 0; i < actionList.length; i++) {
    actionList[i].actionSx = 15 * 1;
    actionList[i].showAction = true;
  }
  actionList.splice(0,actionList.length);
}

function goldAction(actionList) {
  for (var i = 0; i < actionList.length; i++) {
    var nearestMine = findClosestUnitInRange(actionList[i].x, actionList[i].y, UNIT_AI_MINE_RANGE, mines, mines);
    if (nearestMine) {
      actionList[i].myTarget = nearestMine;
      actionList[i].actionSx = 15 * 2;
      actionList[i].showAction = true;
      actionList[i].gotoNear(nearestMine.x,nearestMine.y, 0, 1);
      actionList[i].focus = "mines";
    } else {
        console.log("goldAction: unit was unable to find a nearby mine");
    }
  }
  actionList.splice(0,actionList.length);
}

function farmAction(actionList) {
  for (var i = 0; i < actionList.length; i++) {
    var nearestFarm = findClosestUnitInRange(actionList[i].x, actionList[i].y, UNIT_AI_FARM_RANGE, buildingUnits, "peasant farm");
    actionList[i].myTarget = nearestFarm;
    actionList[i].actionSx = 15 * 3;
    actionList[i].showAction = true;
    actionList[i].gotoNear(actionList[0].myTarget.x,actionList[0].myTarget.y, 0, 1);
  }
  actionList.splice(0,actionList.length);
}

// Construction-related actions
function constructionAction(actionList) {
  buttonDelayTicks = 60;
  startDelayTimer = true;
  buttonDelayTimer = false;
  peasantMainMenu = false;
  peasantConstructionMenu = true;
  for (var i = 0; i < actionList.length; i++) {
    actionList[i].actionSx = 15 * 4;
    actionList[i].showAction = true;
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
    if(woodAvailable >= 5 &&
      goldAvailable >= 5){
      populateTeam(buildingUnits,1,true, "wall");
      var newUnit = buildingUnits.length-1;
      buildingUnits[newUnit].x = mouseX + camera.x; 
      buildingUnits[newUnit].y = mouseY + camera.y;
      wallReadyToBePlace = false;
      buttonDelayTimer = false;
      showWallToBuild = false;
      peasantMainMenu = true;
      selectedUnits = [];
      woodConsumed =+ 5;
      goldConsumed =+ 5;
    } else {
      notEnoughWoodSound.play();
    }
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
    if(goldAvailable >= 2 &&
       woodAvailable >= 10){
      console.log("UI Place Farm")
      populateTeam(buildingUnits,1,true, "peasant farm");
      var currentBuilding = buildingUnits.length-1;
      buildingUnits[currentBuilding].buildingInProgress = true;
      farmReadyToBePlaced = false;
      buttonDelayTimer = false;
      showFarmToBuild = false;
      peasantMainMenu = true;
      for (var i = 0; i < selectedUnits.length; i++) {
        var nearestFarm = findClosestUnitInRange(selectedUnits[0].x, selectedUnits[0].y, UNIT_AI_FARM_RANGE, buildingUnits, "peasant farm");
        selectedUnits[0].myTarget = nearestFarm;
        selectedUnits[0].actionSx = 15 * 3;
        selectedUnits[0].showAction = true;
        selectedUnits[0].gotoNear(selectedUnits[0].myTarget.x,selectedUnits[0].myTarget.y+30, 0, 1);
      }
      selectedUnits = [];
      assignmentTotals.farmsBuilt++; // add to stats totals. FIXME: is this the best place for this?
      goldConsumed += 2;
      woodconsumed += 10;
    } else {
      notEnoughGoldSound.play();
      farmReadyToBePlaced = false;
      buttonDelayTimer = false;
      showFarmToBuild = false;
      peasantMainMenu = true;
    }
  }
}

function displayTowerToBuild(){
  if(buttonDelayTimer){
    showTowerToBuild = true;
    buttonDelayTicks = 10;
    startDelayTimer = true;
    buttonDelayTimer = false;
    towerBuildSelected = false;
    peasantConstructionMenu = false;
    towerReadyToBePlaced = true;
    peasantMainMenu = false;
  }
}

function placeTower() {
  if(buttonDelayTimer && mouseClicked){
    if(goldAvailable >= 100 &&
       foodAvailable >= 30 &&
       woodAvailable >= 100){
      populateTeam(buildingUnits,1,true, "tower");
      var currentBuilding = buildingUnits.length-1;
      buildingUnits[currentBuilding].buildingInProgress = true;
      towerReadyToBePlaced = false;
      buttonDelayTimer = false;
      showTowerToBuild = false;
      peasantMainMenu = true;
      for (var i = 0; i < selectedUnits.length; i++) {
        var nearestTower = findClosestUnitInRange(selectedUnits[0].x, selectedUnits[0].y, 100000, buildingUnits, "tower");
        selectedUnits[0].myTarget = nearestTower;
        selectedUnits[0].actionSx = 15 * 3;
        selectedUnits[0].showAction = true;
        selectedUnits[0].gotoNear(selectedUnits[0].myTarget.x,selectedUnits[0].myTarget.y+30, 0, 1);
      }
      selectedUnits = [];
      goldConsumed =+ 100;
      foodConsumed =+ 30;
      woodconsumed =+ 100;
      assignmentTotals.towersBuilt++; // add to stats totals. FIXME: is this the best place for this?
    } else if (goldAvailable < 100) {
      notEnoughGoldSound.play();
    } else if (foodAvailable < 30) {
      notEnoughFoodSound.play();
    } else {
      notEnoughGoldSound.play();
    }
  }
}

function returnToPeasantMainMenu(){
  peasantConstructionMenu = false;
  peasantMainMenu = true;
}

function recruitPeasant(){
  if(foodAvailable >= 10 && goldAvailable >= 1){
    headQuartersUI = false;
    populateTeam(playerUnits, 1, true, "peasant");
    var newUnit = playerUnits.length-1;
    playerUnits[newUnit].x = buildingUnits[0].x;
    playerUnits[newUnit].y = buildingUnits[0].y;
    var nearestTreeFound = findClosestUnitInRange(playerUnits[newUnit].x, playerUnits[newUnit].y, UNIT_AI_TREE_RANGE, trees, null);
    playerUnits[newUnit].myTarget = nearestTreeFound;
    playerUnits[newUnit].focus = 'trees';
    peasantRecruitmentHooveringSound.play();
    foodConsumed =+ 10;
    goldConsumed =+ 1;
  } else {
    notEnoughFoodSound.play();
  }
}

function recruitWarrior(){
  if(foodAvailable >= 30 && 
     goldAvailable < 10){
    headQuartersUI = false;
    populateTeam(playerUnits, 1, true, "warrior");
    var newUnit = playerUnits.length-1;
    playerUnits[newUnit].x = buildingUnits[0].x;
    playerUnits[newUnit].y = buildingUnits[0].y;
    var keepAtHQ = findClosestUnitInRange(playerUnits[newUnit].x,playerUnits[newUnit].y,5600, buildingUnits);
    playerUnits[newUnit].myTarget = keepAtHQ;
    playerUnits[newUnit].focus = 'trees'; //change to patrol when available
    warriorRecruitmentHoovering.play();
    foodConsumed =+ 30;
    goldConsumed =+ 10;
  } else if (foodAvailable < 30) {
    notEnoughFoodSound.play();
  } else {
    notEnoughGoldSound.play();
  }
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
   // console.log(buildWallHovering,farmBuildHovering, towerButtonHovering, peasantReturnMenuHovering)
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

function drawTopBarResourceTotalsGUI() {
  //indicator top of screen
  //if (peasantSelected || warriorSelected) {
    const topBarRGB = "White";
    const topBarFont = "14px Arial";
    drawBitmapAtLocation(peasantPic, 0, 60, 15, 15, 100, 10);
    drawBitmapAtLocation(warriorPic, 0, 60, 20, 20, 160, 8);
    // FIXME: these need to actually count # peasans and warriors
    colorText(" = " + playerUnits.length, 120, 22, topBarRGB, topBarFont);
    colorText(" = " + playerUnits.length, 180, 22, topBarRGB, topBarFont);
    // FIXME: this is a temp placeholder for total assets owned
    var totalGold = countPlayerGold();
    var totalWood = countPlayerWood();
    var totalFood = countPlayerFood();
    foodAvailable = totalFood - foodConsumed;
    woodAvailable = totalWood - woodConsumed;
    goldAvailable = totalGold - goldConsumed

    drawBitmapAtLocation(resourceIconsPic, 0, 0, 16, 16, 220, 8);
    colorText(" = "+totalWood, 240, 22, topBarRGB, topBarFont);
    drawBitmapAtLocation(resourceIconsPic, 16, 0, 16, 16, 280, 8);
    colorText(" = "+totalGold, 300, 22, topBarRGB, topBarFont);
    drawBitmapAtLocation(resourceIconsPic, 32, 0, 16, 16, 340, 8);
    colorText(" = "+totalFood, 360, 22, topBarRGB, topBarFont);
  //}
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
  drawTopBarResourceTotalsGUI();

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
      colorText("Wood: 5", wallX+70, wallY+30, "white", "14px Arial");
      colorText("Gold: 5", farmBuildX+70, farmBuildY+60, "white", "14px Arial");
    } 
    drawButton(farmBuildX, farmBuildY, userInterfacePic, 480, "BUILD", "FARM", farmBuildHovering, farmBuildSelected);
    if(farmBuildHovering){
      colorText("Wood: 10", farmBuildX+70, farmBuildY+30, "white", "14px Arial");
      colorText("Gold: 2", farmBuildX+70, farmBuildY+60, "white", "14px Arial");
    }
    drawButton(towerX, towerY, userInterfacePic, 720, "BUILD", "TOWER", towerButtonHovering, towerButtonSelected);
    if(towerButtonHovering){
      colorText("Wood: 300", towerX+70, towerY+30, "white", "14px Arial");
      colorText("Food: 300", towerX+70, towerY+60, "white", "14px Arial");
      colorText("Gold: 300", towerX+70, towerY+90, "white", "14px Arial");
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
        colorText("Food: 10", recruitPeasantX+70, recruitPeasantY+30, "white", "14px Arial");
      } 
    drawButton(recruitWarriorX, recruitWarriorY, userInterfacePic, 660, "RECRUIT", "WARRIOR", recruitWarriorBoxHovering, recruitWarrior);
      if(recruitWarriorBoxHovering){
        colorText("Food: 30", recruitWarriorX+70, recruitWarriorY+30, "white", "14px Arial");
      } 
  }
}