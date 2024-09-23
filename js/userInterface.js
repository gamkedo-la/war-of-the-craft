var constructionX = 10;
var constructionY = 120;
var lumberX = 10;
var lumberY = 200;
var pictureWidth = 60;
var pictureHeight = 60;
var lumberButtonHovering = false;
var lumberButtonSelected = false;
var constructionButtonHovering = false;
var constructionButtonSelected = false;
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
var wallX = 10;
var wallY = 120;
var buildWallHoovering = false;
var buildWallSelected = false;

var goldButtonHovering = false;
var goldButtonSelected = false;
var peasantSelected = false;
var warriorSelected = false;

var buttonDelayTicks = 60;
var buttonDelayTimer = false;
var startDelayTimer = false;

var showWallToBuild = false;


function checkButtonHandling(){
  if(peasantSelected && !constructionButtonSelected){
    constructionY = 120;
    lumberY = 200;
    attackY = 300;
    goldY = 380;
    farmY = 480;

    lumberButtonHovering = checkMouseInsideBox(lumberX, lumberY, pictureWidth, pictureHeight);    
    attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
    goldButtonHovering = checkMouseInsideBox(goldX, goldY, pictureWidth, pictureHeight);
    farmButtonHovering = checkMouseInsideBox(farmX, farmY, pictureWidth, pictureHeight);
    constructionButtonHovering = checkMouseInsideBox(constructionX, constructionY, pictureWidth, pictureHeight);
    
    if(mouseClicked && lumberButtonHovering){
      lumberButtonSelected = true;
      for(var i=0;i<selectedUnits.length;i++) {
        var nearestTreeFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_TREE_RANGE, trees, null);
        selectedUnits[i].myTarget = nearestTreeFound;
        selectedUnits[i].actionSx = 0;
        selectedUnits[i].showAction = true;
      } 
    } else {
      lumberButtonSelected = false;
    }
  
    if(mouseClicked && attackButtonHovering){
      attackButtonSelected = true;
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].actionSx = 15*1;
        selectedUnits[i].showAction = true;
      }
    } else {
      attackButtonSelected = false;
    }
  
    if(mouseClicked && goldButtonHovering){
      goldButtonSelected = true;
      for(var i=0;i<selectedUnits.length;i++) {
        var nearestMineFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_MINE_RANGE, mines, null);
        selectedUnits[i].myTarget = nearestMineFound;
        selectedUnits[i].actionSx = 15*2;
        selectedUnits[i].showAction = true;
      } 
    } else {
      goldButtonSelected = false;
    }
  
    if(mouseClicked && farmButtonHovering){
      farmButtonSelected = true;
      for(var i=0;i<selectedUnits.length;i++) {
          debugger;
          var nearestFarmFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_FARM_RANGE, buildingUnits, "peasant farm");
          selectedUnits[i].myTarget = nearestFarmFound;
        selectedUnits[i].actionSx = 15*3;
        selectedUnits[i].showAction = true;
      }
    } else {
      farmButtonSelected = false;
    }

    if(mouseClicked && constructionButtonHovering){
      constructionButtonSelected = true;
      buttonDelayTicks = 60;
      startDelayTimer = true;
      buttonDelayTimer = false;
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].actionSx = 15*4;
        selectedUnits[i].showAction = true;
      }
    } else {
      constructionButtonSelected = false;
    }
  } else if (showWallToBuild && mouseClicked){
    showWallToBuild = false;
    peasantSelected = false;
    buildWallSelected = false;
    constructionButtonSelected = false;
    populateTeam(buildingUnits,0,true, "wall");
  } else if (peasantSelected && buildWallSelected){
    showWallToBuild = true;
  } else if (peasantSelected && constructionButtonSelected){
    buildWallHoovering = checkMouseInsideBox(wallX, wallY, pictureWidth, pictureHeight);
    if(mouseClicked && buildWallHoovering && buttonDelayTimer){
      buildWallSelected = true;
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].actionSx = 15*4;
        selectedUnits[i].showAction = true;
      }
    } else {
      buildWallSelected = false;
    }
  } else if (warriorSelected){
    attackY = 120;
    attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
    
    if(mouseClicked && attackButtonHovering){
      attackButtonSelected = true;
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].actionSx = 15*1;
        selectedUnits[i].showAction = true;
      }
    } else {
      attackButtonSelected = false;
    }
  }
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

function drawUserInterface(){
  if(startDelayTimer){
    buttonDelayTicks--;
    if(buttonDelayTicks <= 0){
      buttonDelayTimer = true;
      startDelayTimer = false;
    }
  }

  if(peasantSelected || warriorSelected){ //will change this shortly to a different requirement
    drawBitmapAtLocation(peasantPic, 0,60, 15, 15, 100, 10);
    drawBitmapAtLocation(warriorPic, 0,60, 20, 20, 160, 8);
    colorText(" = " + playerUnits.length, 120, 22, "White", "14px Arial");
    colorText(" = " + playerUnits.length, 180, 22, "White", "14px Arial");
  }

  if(peasantSelected && !constructionButtonSelected){
    drawBitmapAtLocation(peasantProfilePic, 0,120, pictureWidth, pictureHeight, 10, 36);
    colorText("PEASANT", 9, 20, "Yellow", "14px Arial");
    colorText("OPTIONS", 9, 116, "Yellow", "14px Arial");
    //construction
    if(constructionButtonHovering && mouseClicked){ //picture
      drawBitmapAtLocation(lumberPic, 60,60, pictureWidth, pictureHeight, constructionX, constructionY);
    } else {
      drawBitmapAtLocation(lumberPic, 0,60, pictureWidth, pictureHeight, constructionX, constructionY);
    }
    //lumber
    if(lumberButtonHovering && mouseClicked){ //picture
      drawBitmapAtLocation(lumberPic, 60,60, pictureWidth, pictureHeight, lumberX, lumberY);
    } else {
      drawBitmapAtLocation(lumberPic, 0,60, pictureWidth, pictureHeight, lumberX, lumberY);
    }
    //construction
    if(constructionButtonHovering){ //frame
      drawBitmapAtLocation(framePic, 60,360, pictureWidth, pictureHeight, constructionX, constructionY);
      colorText("BUILD", 18, constructionY+pictureHeight+15, "Yellow", "14px Arial");
    } else {
      drawBitmapAtLocation(framePic, 0,360, pictureWidth, pictureHeight, constructionX, constructionY);
      colorText("BUILD", 18, constructionY+pictureHeight+15, "White", "14px Arial");
    }
    if(lumberButtonHovering){ //frame
      drawBitmapAtLocation(framePic, 60,0, pictureWidth, pictureHeight, lumberX, lumberY);
      colorText("GATHER", 9, lumberY+pictureHeight+15, "Yellow", "14px Arial");
      colorText("LUMBER", 9, lumberY+pictureHeight+29, "Yellow", "14px Arial");
    } else {
      drawBitmapAtLocation(framePic, 0,0, pictureWidth, pictureHeight, lumberX, lumberY);
      colorText("GATHER", 9, lumberY+pictureHeight+15, "White", "14px Arial");
      colorText("LUMBER", 9, lumberY+pictureHeight+29, "White", "14px Arial");
    }
    if(lumberButtonHovering && mouseClicked){ //text
      colorText("GATHER", 9, lumberY+pictureHeight+15, "Green", "14px Arial");
      colorText("LUMBER", 9, lumberY+pictureHeight+29, "Green", "14px Arial");
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
      colorText("ATTACK", 11, attackY+pictureHeight+15, "White", "14px Arial");
    }
    if(attackButtonHovering && mouseClicked){ //text
      colorText("ATTACK", 11, attackY+pictureHeight+15, "Green", "14px Arial");
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
      colorText("MINE", 19, goldY+pictureHeight+15, "White", "14px Arial");
      colorText("GOLD", 18, goldY+pictureHeight+29, "White", "14px Arial");
    }
    if(goldButtonHovering && mouseClicked){ //text
      colorText("MINE", 19, goldY+pictureHeight+15, "Green", "14px Arial");
      colorText("GOLD", 18, goldY+pictureHeight+29, "Green", "14px Arial");
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
      colorText("FARM", 19, farmY+pictureHeight+15, "White", "14px Arial");
      colorText("FOOD", 18, farmY+pictureHeight+29, "White", "14px Arial");
    }
    if(farmButtonHovering && mouseClicked){ //text
      colorText("FARM", 19, farmY+pictureHeight+15, "Green", "14px Arial");
      colorText("FOOD", 18, farmY+pictureHeight+29, "Green", "14px Arial");
    } 
  } else if (constructionButtonSelected){  //// Construction Screen
    drawBitmapAtLocation(peasantProfilePic, 0,120, pictureWidth, pictureHeight, 10, 36);
    colorText("PEASANT", 9, 20, "Yellow", "14px Arial");
    colorText("OPTIONS", 9, 116, "Yellow", "14px Arial");

    if(buildWallHoovering){ 
      drawBitmapAtLocation(framePic, 60,420, pictureWidth, pictureHeight, wallX, wallY);
      colorText("WALL", 21, wallY+pictureHeight+15, "Yellow", "14px Arial");
    } else {
      drawBitmapAtLocation(framePic, 0,420, pictureWidth, pictureHeight, wallX, wallY);
      colorText("WALL", 21, wallY+pictureHeight+15, "White", "14px Arial");
    }
  } else if(warriorSelected) {
    drawBitmapAtLocation(peasantProfilePic, pictureWidth*2,120, pictureWidth, pictureHeight, 10, 36);//warrior
    colorText("WARRIOR", 9, 20, "Yellow", "14px Arial");
    colorText("OPTIONS", 9, 116, "Yellow", "14px Arial");

    //attacking
    if(attackButtonHovering && mouseClicked && buttonDelayTimer){ //picture
      drawBitmapAtLocation(lumberPic, 60,180, pictureWidth, pictureHeight, attackX, attackY);
    } else {
      drawBitmapAtLocation(lumberPic, 0,180, pictureWidth, pictureHeight, attackX, attackY);
    }
    if(attackButtonHovering){ //frame
      drawBitmapAtLocation(framePic, 60,0, pictureWidth, pictureHeight, attackX, attackY);
      colorText("ATTACK", 11, attackY+pictureHeight+15, "Yellow", "14px Arial");
    } else {
      drawBitmapAtLocation(framePic, 0,0, pictureWidth, pictureHeight, attackX, attackY);
      colorText("ATTACK", 11, attackY+pictureHeight+15, "White", "14px Arial");
    }
    if(attackButtonHovering && mouseClicked){ //text
      colorText("ATTACK", 11, attackY+pictureHeight+15, "Green", "14px Arial");
    }      
  }
}