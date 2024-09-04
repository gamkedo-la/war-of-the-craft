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
var peasantSelected = false;

function checkButtonHandling(){
  if(peasantSelected){
      lumberButtonHovering = checkMouseInsideBox(lumberX, lumberY, pictureWidth, pictureHeight);    
      attackButtonHovering = checkMouseInsideBox(attackX, attackY, pictureWidth, pictureHeight);
      goldButtonHovering = checkMouseInsideBox(goldX, goldY, pictureWidth, pictureHeight);
      farmButtonHovering = checkMouseInsideBox(farmX, farmY, pictureWidth, pictureHeight);
      
      if(mouseClicked && lumberButtonHovering){
        lumberButtonSelected = true;
        for(var i=0;i<selectedUnits.length;i++) {
          var nearestTreeFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_TREE_RANGE, trees);
          selectedUnits[i].myTarget = nearestTreeFound;
          selectedUnits[i].actionSx = 0;
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
        for(var i=0;i<selectedUnits.length;i++) {
          var nearestMineFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_MINE_RANGE, mines);
          selectedUnits[i].myTarget = nearestMineFound;
          selectedUnits[i].actionSx = 15*2;
          selectedUnits[i].showAction = true;
        } 
      } else {
        goldButtonSelected = false;
      }
    
      if(mouseClicked && farmButtonHovering){
        farmButtonSelected = true;
      } else {
        farmButtonSelected = false;
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
  if(peasantSelected){ //will change this shortly to a different requirement
    drawBitmapAtLocation(userInterfaceBackgroundPic, 0, 0, 800, 600, 0, 0);
    colorRect(10, 5, 200, 70, "white");
    drawBitmapAtLocation(peasantPic, 0,60, 15, 15, 15, 10);
    colorText(" = " + playerUnits.length, 30, 22, "black", "14px Arial");
  }

  if(peasantSelected){
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
}