const UNIT_PLACEHOLDER_RADIUS = 5;
const UNIT_SELECT_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;
const UNIT_PIXELS_MOVE_RATE = 2;
const UNIT_RANKS_SPACING = UNIT_PLACEHOLDER_RADIUS * 3;
const UNIT_ATTACK_RANGE = 15;
const UNIT_AI_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 10;
const UNIT_AI_ORC_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 90;
const UNIT_PLAYABLE_AREA_MARGIN = 20;
const UNIT_AI_TREE_RANGE = 20000000;
const UNIT_AI_MINE_RANGE = 20000000;
const UNIT_AI_FARM_RANGE = 20000000;

var gatherLumber = 0;
var attackTarget = 15;
var mineGold = 30;
var farmFood = 45;

function unitClass(type) {
    this.x = 0;
    this.y = 0;
    this.healthSx = 0;
    this.healthSy = 0;
    this.sX = 0;
    this.sY = 0;
    this.lumber = 0;
    this.food = 0;
    this.jobType = type;
    this.collFill = 0.2; 
    this.collDim = 1;
    this.minimapDrawPriority = 5;
    this.focus = null;

    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        this.playerControlled = playerTeam;
        // ensure the unit is not standing on water etc
        let validLocation = false;
        while (!validLocation) {
            this.x = Math.random()*WORLD_SIZE_PIXELS_W;
            this.y = Math.random()*WORLD_SIZE_PIXELS_H;
            let index = colRowToIndex (this.x,this.y);
            validLocation = presetUnwalkableTiles.indexOf(index)==-1;
        }
        this.width = 15;
        this.height = 15;
        this.sY = 4 * this.height;
        this.myTarget = trees;
        this.attackCoolDown = 90;
        this.treeDist = 100;
        this.playerHQDist = 100;
        this.choppingWood = false;
        this.showHealthBar = false;
        this.showHealthBarCoolDown = 90;
        this.doneWithTarget = false;
        this.walking = false;
        this.frame = 0;
        this.frameTicks = 0; 
        this.action = [gatherLumber, attackTarget, mineGold, farmFood]
        this.actionSx = 0;
        this.showAction = false;
        this.tilePath = [];
        this.delaySound = 0;
        this.patroling = false;

        if (this.playerControlled == false) {
            this.x = WORLD_SIZE_PIXELS_W - this.x;
            this.y = WORLD_SIZE_PIXELS_H - this.y;
            this.unitColor = 'Red';
            if(this.jobType == "goblin"){
                this.pic = goblinPic;
                this.health = 4;
            } else if (this.jobType == "orc"){
                this.pic = orcPic;
                this.health = 10;
                this.width = 20;
                this.height = 20;
            }
        } else {
         //   console.log("jobType:", this.jobType);
            this.unitColor = 'White';
            if(this.jobType === "peasant"){
                this.pic = peasantPic;
                this.health = 4;
                this.type = "peasant";
            } else if (this.jobType === "warrior"){
                this.pic = warriorPic;
                this.health = 10;
                this.width = 20;
                this.height = 20;
                this.type = "warrior";
                this.myTarget = "trees";
                this.focus = "mines"; //change in future to patrol
                this.returntoHQAction();

            }
        }

        for (var i = 0; i < buildingUnits.length; i++) {
            var isTreeCloseToBuilding = this.distFromSq(buildingUnits[i].x, buildingUnits[i].y);
            if (isTreeCloseToBuilding < 70) {
                this.x = this.x + 70;
                this.y = this.y + 70;
            }
        }
        this.iD = this.unitColor + " " + idNumber;
        this.gotoX = this.x;
        this.gotoY = this.y;
        this.isDead = false;
    }

    this.distFrom = function(otherX, otherY) {
        var deltaX = otherX - this.x;
        var deltaY = otherY - this.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    this.distFromSq = function(otherX, otherY) { //return square distance faster for comparison, not accuracy
        var deltaX = otherX-this.x;
        var deltaY = otherY-this.y;
        return deltaX*deltaX + deltaY*deltaY;
    } 

    this.setTarget = function(newTarget) {
        this.myTarget = newTarget;
        this.myTarget.showHealthBar = true;
        this.showHealthBar = true;
    }

    this.identifyNewTarget = function(){
     
    }

    this.gotoNear = function(aroundX, aroundY, formationPos, formationDim) {
        if(formationDim == 0){
            formationDim = 1;
        }
        var colNum = formationPos % formationDim;
        var rowNum = Math.floor(formationPos / formationDim);
        var targetX = aroundX + colNum * UNIT_RANKS_SPACING;
        var targetY = aroundY + rowNum * UNIT_RANKS_SPACING;
        // convert goal into pathfinding array
        var goalTile = pixelCoordToIndex(targetX, targetY);
        startPath(goalTile, this);
        //startPath(100, playerUnits[0]);
 //       console.log("Tile Path Length: " + this.tilePath.length)
    }

    this.chopTreeAction = function(){
        this.choppingWood = true;
        this.delaySound--;
        if(this.delaySound <= 0){
            peasantChoppingTree.play();
            this.delaySound = 20;
        }
        this.myTarget.effort--;
        if(this.myTarget.effort == 0 || this.myTarget.isDead){
            assignmentTotals.woodChopped++; // add to stats totals
            if (this.lumber) this.lumber++; else this.lumber = 1;
            this.choppingWood = false;
            this.myTarget.isDead = true;
            this.showAction = false;
            soonCheckUnitsToClear();
            this.returntoHQAction();
        }
    }

    this.mineGoldAction = function(){
        this.miningGold = true;
        this.myTarget.effort--;
        if(this.myTarget.effort == 0){
            assignmentTotals.goldMined++; // add to stats totals
            if (this.gold) this.gold++; else this.gold = 1;
            this.miningGold = false;
            this.myTarget.effort = 100;
            //this.myTarget.isDead = true; // use up the mine???
            this.showAction = false;
            soonCheckUnitsToClear();
            this.returntoHQAction();
        }
    }

    this.returntoHQAction = function() {
        var nearestHQFound;
        //console.log(this.unitColor)
        if(this.unitColor == 'Red'){
  //          console.log("Red unit returning to HQ");
            nearestHQFound = findClosestFriendlyBuildingInRange(this.x, this.y, 1000000000, buildingUnits, null, 'Red');
        } else if (this.unitColor == 'White') {
            console.log("White unit returning to HQ");
            nearestHQFound = findClosestFriendlyBuildingInRange(this.x, this.y, 1000000000, buildingUnits, null, 'White');
        }
        this.myTarget = nearestHQFound;
  //      console.log("Nearest HQ found has type: " + this.myTarget.type)
        this.actionSx = 15*5;
        this.showAction = true;
        this.gotoNear(this.myTarget.x,this.myTarget.y, 0, 1);
    }

    this.isInBox = function(x1, y1, x2, y2) {
        var leftX = Math.min(x1, x2);
        var rightX = Math.max(x1, x2);
        var topY = Math.min(y1, y2);
        var bottomY = Math.max(y1, y2);
    
        return (this.x >= leftX && this.x <= rightX && this.y >= topY && this.y <= bottomY);
    };

    this.keepInPlayableArea = function() {
        if (this.gotoX < UNIT_PLAYABLE_AREA_MARGIN) {
            this.gotoX = UNIT_PLAYABLE_AREA_MARGIN;
        } else if (this.gotoX > canvas.width - UNIT_PLAYABLE_AREA_MARGIN) {
            this.gotoX = canvas.width - UNIT_PLAYABLE_AREA_MARGIN;
        }

        if (this.gotoY < UNIT_PLAYABLE_AREA_MARGIN) {
            this.gotoY = UNIT_PLAYABLE_AREA_MARGIN;
        } else if (this.gotoY > canvas.height - UNIT_PLAYABLE_AREA_MARGIN) {
            this.gotoY = canvas.height - UNIT_PLAYABLE_AREA_MARGIN;
        }
    }

    this.move = function() {
        var wasTileIndex = pixelCoordToIndex(this.x,this.y);
      //  console.log("Tile Path Length: " + this.tilePath.length)
        if(this.tilePath.length>0){
            //this.myTarget = null;
            //step 1:  check if we are on the next tile, if so, chop 1 off front of list
            if(this.tilePath[0] == wasTileIndex){
                this.tilePath.shift(); //skip to next tile
            }
            //step 2:  walk in direction of next tile
            if(this.tilePath.length>0){
                this.gotoX = indexToPixelX(this.tilePath[0]);
                this.gotoY = indexToPixelY(this.tilePath[0]);
            }
        } else if (this.myTarget != null) {
            //   console.log("Target: " + this.myTarget.type)
            if (this.myTarget.isDead) {
                this.myTarget = null;
                this.gotoX = this.x;
                this.gotoY = this.y;
            } else if (this.myTarget.type == "goblins hq"){
                this.gotoX = this.myTarget.x-10;
                this.gotoY = this.myTarget.y+5;
                this.playerHQdist = this.distFrom(this.gotoX, this.gotoY);
                if(this.playerHQdist < 3){
                    console.log("At enemy HQ with this focus: "+this.focus);
                    
                    ////////////////////////////////////////////////////
                    // deliver any resources the unit is carrying
                    // FIXME: is this supposed to be somewhere else?
                    // FIXME: should this take time (one per tick etc - like chopping wood?)
                    if (this.lumber) {
                        console.log("delivered "+this.lumber+" lumber to HQ");
                        if (!this.myTarget.lumber) this.myTarget.lumber = 0; // avoid NaN
                        this.myTarget.lumber += this.lumber;
                        this.lumber = 0;
                    }
                    if (this.gold) {
                        console.log("delivered "+this.gold+" gold to HQ");
                        if (!this.myTarget.gold) this.myTarget.gold = 0; // avoid NaN
                        this.myTarget.gold += this.gold;
                        this.gold = 0;
                    }
                    if (this.food) {
                        console.log("delivered "+this.food+" food to HQ");
                        if (!this.myTarget.food) this.myTarget.food = 0; // avoid NaN
                        this.myTarget.food += this.food;
                        this.food = 0;
                    }
                    if(this.focus == "trees"){
                        var nearestTreeFoundForPeasant = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees, trees);
                        if (nearestTreeFoundForPeasant) {
                            this.myTarget = nearestTreeFoundForPeasant;
                            this.actionSx = 0;
                            this.showAction = true;
                            this.gotoNear(this.myTarget.x,this.myTarget.y, 0, 1);
                        } else {
                            console.log("unit at hq unable to find a tree to return to");
                        }
                    }
                    if(this.focus == "mines"){
                        var nearestMineFoundForPeasant = findClosestUnitInRange(this.x, this.y, UNIT_AI_MINE_RANGE, mines, mines);
                        if (nearestMineFoundForPeasant) {
                            this.myTarget = nearestMineFoundForPeasant;
                            this.actionSx = 0;
                            this.showAction = true;
                            this.gotoNear(this.myTarget.x+20,this.myTarget.y+25, 0, 1);
                        } else {
                            console.log("unit at hq unable to find a mine to return to");
                        }
                    }
                }
            } else if (this.myTarget.type == "trees"){
                this.gotoX = this.myTarget.x-10;
                this.gotoY = this.myTarget.y+5;
                this.treeDist = this.distFrom(this.gotoX, this.gotoY);
                if(this.treeDist < 3){
                    this.chopTreeAction();
                }
            } else if (this.myTarget.type == "mines"){
                this.gotoX = this.myTarget.x-10;
                this.gotoY = this.myTarget.y+5;
                this.mineDist = this.distFrom(this.gotoX, this.gotoY);
                if(this.mineDist < 3){
                    this.mineGoldAction();
                }    
            } else if (this.myTarget.type == "players hq"){
                this.gotoX = this.myTarget.x-10;
                this.gotoY = this.myTarget.y+5;
                this.playerHQdist = this.distFrom(this.gotoX, this.gotoY);
                if(this.playerHQdist < 3){
                    console.log("At player HQ with this focus: "+this.focus);
                    
                    ////////////////////////////////////////////////////
                    // deliver any resources the unit is carrying
                    // FIXME: is this supposed to be somewhere else?
                    // FIXME: should this take time (one per tick etc - like chopping wood?)
                    if (this.lumber) {
                        console.log("delivered "+this.lumber+" lumber to HQ");
                        if (!this.myTarget.lumber) this.myTarget.lumber = 0; // avoid NaN
                        this.myTarget.lumber += this.lumber;
                        this.lumber = 0;
                    }
                    if (this.gold) {
                        console.log("delivered "+this.gold+" gold to HQ");
                        if (!this.myTarget.gold) this.myTarget.gold = 0; // avoid NaN
                        this.myTarget.gold += this.gold;
                        this.gold = 0;
                    }
                    if (this.food) {
                        console.log("delivered "+this.food+" food to HQ");
                        if (!this.myTarget.food) this.myTarget.food = 0; // avoid NaN
                        this.myTarget.food += this.food;
                        this.food = 0;
                    }

                    if(this.focus == "trees"){
                        var nearestTreeFoundForPeasant = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees, trees);
                        if (nearestTreeFoundForPeasant) {
                            this.myTarget = nearestTreeFoundForPeasant;
                            this.actionSx = 0;
                            this.showAction = true;
                            this.gotoNear(this.myTarget.x,this.myTarget.y, 0, 1);
                        } else {
                            console.log("unit at hq unable to find a tree to return to");
                        }
                    }
                    if(this.focus == "mines"){
                        var nearestMineFoundForPeasant = findClosestUnitInRange(this.x, this.y, UNIT_AI_MINE_RANGE, mines, mines);
                        if (nearestMineFoundForPeasant) {
                            this.myTarget = nearestMineFoundForPeasant;
                            this.actionSx = 0;
                            this.showAction = true;
                            this.gotoNear(this.myTarget.x+20,this.myTarget.y+25, 0, 1);
                        } else {
                            console.log("unit at hq unable to find a mine to return to");
                        }
                    }
                }
            } else if (this.myTarget.type == "mines"){
                this.gotoX = this.myTarget.x+15;
                this.gotoY = this.myTarget.y+20;
                this.mineDist = this.distFrom(this.gotoX, this.gotoY+8);
                if(this.mineDist < 3){
                    this.mineGoldAction();
                }                
            } else if (this.distFromSq(this.myTarget.x, this.myTarget.y) > UNIT_ATTACK_RANGE * UNIT_AI_TREE_RANGE) {
                this.gotoX = this.myTarget.x;
                this.gotoY = this.myTarget.y;
            } else {
           //   console.log("Cool Down: " + this.attackCoolDown)
                if(this.attackCoolDown <= 0) {
                    if (this.myTarget.type == "mines" || this.myTarget.type == "trees" || this.myTarget.type == "peasant farm") {
                        this.collectResourse(this.myTarget.type, 600);//maybe we can make a variable for this.myTarget.attackCooldown
                    } else if (this.myTarget.type == "goblins hq"){
                        this.returnResource();
                    } else {
                        this.myTarget.health--;
                        if(this.myTarget.jobType == "peasant"){
                            peasantHurtSound.play();
                        }
                    }
                    this.showHealthBar = true;
                } else {
                    this.attackCoolDown--;
                }
                if (this.myTarget && this.myTarget.health <= 0) {
                    this.myTarget.isDead = true;
                    this.myTarget.sX = this.myTarget.health * 15;
                }
                soonCheckUnitsToClear();
                this.gotoX = this.x;
                this.gotoY = this.y;
            }
        } else if (this.playerControlled == false) {
            var nearestOpponentFound = null;
            var nearestTreeFound = null;
            var nearestMindFound = null;
            var nearestHQFound = null;
            var nearestOpponentFound = null;
            nearestOpponentFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_ORC_ATTACK_INITIATE, playerUnits, null);

            if(this.lumber <= 2 && this.jobType == "goblin" && nearestOpponentFound == null){
                nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees, null);
                this.myTarget = nearestTreeFound;
            } else if (this.lumber == 3 && this.jobType == "goblin") {
                nearestHQFound = findClosestUnitInRange(this.x,this.y,1000, buildingUnits, null);
                this.myTarget = nearestHQFound;
                this.attackCoolDown = 60;
            } else {
                this.myTarget = nearestOpponentFound;
                this.attackCoolDown = 60;
            }
                
            /*if(this.myTarget == null){
                this.gotoX = this.x - Math.random() * 70;
                this.gotoY = this.y - Math.random() * 70;
             
                this.keepInPlayableArea();
            }*/

            if (this.myTarget!=undefined && Math.random() < 0.02) {
                if(this.myTarget.type == "goblins hq" && this.jobType == "goblin"){
                    console.log(this.idNumber + " HQ + " + this.lumber)
                    if(this.lumber > 0){
                        nearestHQFound = findClosestUnitInRange(this.x,this.y,600, buildingUnits, null);
                        this.myTarget = nearestHQFound;
                        this.attackCoolDown = 60;
                    } else {
                        nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees, null);
                        this.myTarget = nearestTreeFound;
                    }
                } else if (this.myTarget.type == "trees" && this.jobType == "goblin"){
                    if(this.lumber > 2){
                        nearestHQFound = findClosestUnitInRange(this.x,this.y,5600, buildingUnits);
                        this.myTarget = nearestHQFound;
                    } else {
                        nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees, null);
                        this.myTarget = nearestTreeFound;
                    }
                } else if (this.myTarget.type == "peasant"){
                    nearestOpponentFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_ATTACK_INITIATE, playerUnits, null);
                } else {
                    this.gotoX = this.x - Math.random() * 70;
                    this.gotoY = this.y - Math.random() * 70;
                    this.keepInPlayableArea();
                }
            }
        }

        var deltaX = this.gotoX - this.x;
        var deltaY = this.gotoY - this.y;
        var distToGo = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var moveX = UNIT_PIXELS_MOVE_RATE * deltaX / distToGo;
        var moveY = UNIT_PIXELS_MOVE_RATE * deltaY / distToGo;

        if (distToGo > UNIT_PIXELS_MOVE_RATE) {
            this.x += moveX;
            this.y += moveY;
            this.walking = true;
        } else {
            this.x = this.gotoX;
            this.y = this.gotoY;
        }
        var newTileIndex = pixelCoordToIndex(this.x,this.y);
        if(wasTileIndex != newTileIndex){
            removeUnitFromGridIndex(this,wasTileIndex);
            addUnitToGridIndex(this,newTileIndex);
        }
    }

    this.collectResourse = function (type, attackCooldown) {
        switch (type) {
            case "trees":
                this.lumber++;
                this.myTarget.lumber--;
                if (this.myTarget.lumber <= 0) {
                    this.myTarget.isDead = true;
                    soonCheckUnitsToClear();
                    this.myTarget == null;
                }
                if (this.lumber > 2) {
                    this.myTarget == null;
                }
                break;
            case "peasant farm":
                this.food++;
                this.myTarget.food--;
                //console.log(this.food);
                if (this.myTarget.food <= 0) {
                    this.myTarget.isDead = true;
                    soonCheckUnitsToClear();
                    this.myTarget == null;
                }
                if (this.food > 2) {
                    this.myTarget == null;
                }
                break;

            default:
                break;
        }
        this.attackCoolDown = attackCooldown;
    }

    this.returnResource = function() {
        this.attackCoolDown = 60;
        if (this.lumber > 0) {
            this.lumber--;
            this.myTarget.lumber++;
            console.log("Lumber delivered: " + this.myTarget.lumber + " My Lumber: " + this.lumber);
            if(this.lumber == 0){ //dropped off last piece of lumber
              console.log("Last of lumber dropped off");
              var nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees, null);
              this.myTarget = nearestTreeFound;
            }
        }
        else if (this.food > 0) {
            this.food--;
            this.myTarget.food++;
            console.log("Food delivered: " + this.myTarget.food + " My Food: " + this.food);
            if(this.food == 0){ //dropped off last piece of lumber
              console.log("Last of food dropped off");
              var nearestFarmFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_FARM_RANGE, buildingUnits, "peasant farm");
              this.myTarget = nearestFarmFound;
            }
        }
        else if (this.gold > 0) {
            this.gold--;
            this.myTarget.gold++;
            console.log("Gold delivered: " + this.myTarget.gold + " My Gold: " + this.gold);
            if(this.gold == 0){ //dropped off last piece of gold
              console.log("Last of gold dropped off");
              var nearestMineFound = findClosestUnitInRange(selectedUnits[i].x, selectedUnits[i].y, UNIT_AI_MINE_RANGE, buildingUnits, "mines");
              this.myTarget = nearestMineFound;
            }
        }
    }

    this.determinePlayerDirection = function() {
        this.moveNorth = false; //0
        this.moveNorthWest = false; //1
        this.moveWest = false; //2
        this.moveSoutWest = false; //3
        this.moveSouth = false; //4
        this.moveSouthEast = false; //5
        this.moveEast = false; //6
        this.moveNorthEast = false; //7
        this.sY = 4*this.height;

        if (this.gotoY < this.y) {
            this.moveNorth = true;
            this.sY = this.height * 0;
        } else if (this.gotoX < this.x) {
            this.moveWest = true;
            this.sY = this.height * 2;
        } else if (this.gotoX < this.x) {
            this.moveSouth = true;
            this.sY = this.height * 4;
        } else if (this.gotoX > this.x) {
            this.moveEast = true;
            this.sY = this.height * 6;
        }

        if(this.choppingWood){
            this.sY = this.height * 8;
        }
        if(this.mineGold){
            this.sY = 10000; //don't draw
        }

        if(this.lumber > 0){
            this.sX = this.width;
        } else {
            this.sX = 0;
        }
    }

    this.drawSelectionBox = function() {
        coloredOutlineRectCornerToCorner(this.x - UNIT_SELECT_DIM_HALF,
            this.y - UNIT_SELECT_DIM_HALF,
            this.x + UNIT_SELECT_DIM_HALF,
            this.y + UNIT_SELECT_DIM_HALF,
            'lime');
    }

    this.updateMyHealthBar = function() {
        this.healthSx = this.health * 15;
    }

    this.walkingAnimation = function(){
        this.frameTicks++;
        if(this.frameTicks > 3){
            this.frame++;
            this.frameTicks = 0;
            if(this.frame > 4){
                this.frame = 1;
            }
        }
        this.sX = this.frame * this.width;
    }

    this.draw = function() {
        if (this.isDead == false) {
            this.determinePlayerDirection();
            drawBitmapCenteredAtLocation(playerPic, 0, 0, 20, 5, this.x, this.y+6);
            if(this.walking){
                
                if (this.previousX != this.x || this.previousY != this.y) { // actually moving?
                    wildflowers.drawTerrainDecal(this.x-16,this.y-10,footpathPic); // slowly erode a muddy footpath
                    this.walkingAnimation(); // only animate the walking anim when moving
                }
    
            }
            drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY, this.width, this.height, this.x, this.y);
            this.updateMyHealthBar();
            if (this.showHealthBar ||
                this.health < 2) {
                drawBitmapCenteredAtLocation(healthBarPic, this.healthSx, this.sY, 15, 7, this.x, this.y - 13)
                this.showHealthBarCoolDown--;
                if (this.showHealthBarCoolDown <= 0) {
                    this.showHealthBarCoolDown = 90;
                    this.showHealthBar = false;
                }
            }
            if(this.showAction){
                drawBitmapCenteredAtLocation(jobIndicatorPic, this.actionSx, 0, 15, 15, this.x, this.y - 23)
            }
            if (this.myTarget != null) {
                lineDraw(this.x, this.y, this.myTarget.x, this.myTarget.y, this.unitColor);
               // console.log("Target:" + this.myTarget)
            }
        } else {
            colorCircle(this.x + 5, this.y, UNIT_PLACEHOLDER_RADIUS, "yellow", "10px Arial Black");
            //  colorText(this.iD, this.x+10, this.y-10, "yellow")
        }
        // used to detect if we have moved since the previous frame
        this.previousX = this.x;
        this.previousY = this.y;
    }
        
    this.debugDrawPath = function(){
        if(this.tilePath.length > 0){
            var pixelX = indexToPixelX(this.tilePath[0]);
            var pixelY = indexToPixelY(this.tilePath[0]); 
            lineDraw(this.x, this.y, pixelX, pixelY, "lime");
            for(var i = 0; i < this.tilePath.length; i++){
                var prevX = pixelX;
                var prevY = pixelY;
                pixelX = indexToPixelX(this.tilePath[i]);
                pixelY = indexToPixelY(this.tilePath[i]);
                lineDraw(prevX, prevY, pixelX, pixelY, "orange");
            }
        }
    }

    this.drawOnMinimap = function(x,y){
        let BOLD = 1; // draw extra big for clarity
        colorRect(x, y, Math.max(1,this.width / MINIMAPXRELATIVESIZE)+BOLD, Math.max(1,this.height / MINIMAPYRELATIVESIZE)+BOLD, 'rgba(255,255,0,1)');    
    }
}