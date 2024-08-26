const UNIT_PLACEHOLDER_RADIUS = 5;
const UNIT_SELECT_DIM_HALF = UNIT_PLACEHOLDER_RADIUS + 3;
const UNIT_PIXELS_MOVE_RATE = 2;
const UNIT_RANKS_SPACING = UNIT_PLACEHOLDER_RADIUS * 3;
const UNIT_ATTACK_RANGE = 15;
const UNIT_AI_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 10;
const UNIT_AI_ORC_ATTACK_INITIATE = UNIT_ATTACK_RANGE + 90;
const UNIT_PLAYABLE_AREA_MARGIN = 20;
const UNIT_AI_TREE_RANGE = 200;

function unitClass(type) {
    this.healthSx = 0;
    this.healthSy = 0;
    this.sX = 0;
    this.lumber = 0;
    this.jobType = type;

    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        this.playerControlled = playerTeam;
        this.x = Math.random() * canvas.width / 4;
        this.y = Math.random() * canvas.height / 4;
        this.width = 15;
        this.height = 15;
        this.sY = returnRandomInteger(8) * this.height;
        this.myTarget = null;
        this.attackCoolDown = 90;
        this.showHealthBar = false;
        this.showHealthBarCoolDown = 90;
        this.doneWithTarget = false;
        this.walking = false;
        this.frame = 0;
        this.frameTicks = 0;

        if (this.playerControlled == false) {
            this.x = canvas.width - this.x;
            this.y = canvas.height - this.y;
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
            this.unitColor = 'White';
            this.pic = peasantPic;
            this.health = 4;
            this.jobType = "peasant";
            this.type = "peasant";
        }

        for (var i = 0; i < buildingUnits.length; i++) {
            var isTreeCloseToBuilding = this.distFrom(buildingUnits[i].x, buildingUnits[i].y);
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

    this.setTarget = function(newTarget) {
        this.myTarget = newTarget;
        this.myTarget.showHealthBar = true;
        this.showHealthBar = true;
    }

    this.gotoNear = function(aroundX, aroundY, formationPos, formationDim) {
        var colNum = formationPos % formationDim;
        var rowNum = Math.floor(formationPos / formationDim);
        this.gotoX = aroundX + colNum * UNIT_RANKS_SPACING;
        this.gotoY = aroundY + rowNum * UNIT_RANKS_SPACING;
    }

    this.isInBox = function(x1, y1, x2, y2) {
        var leftX, rightX;
        if (x1 < x2) {
            leftX = x1;
            rightX = x2;
        } else {
            leftX = x2;
            rightX = x1;
        }

        var topY, bottomY;
        if (y1 < y2) {
            topY = y1;
            bottomY = y2;
        } else {
            topY = y2;
            bottomY = y1;
        }

        if (this.x < leftX) {
            return false;
        }
        if (this.y < topY) {
            return false;
        }
        if (this.x > rightX) {
            return false;
        }
        if (this.y > bottomY) {
            return false;
        }
        return true;
    }

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
        if (this.myTarget != null) {
            if (this.myTarget.isDead) {
                this.myTarget = null;
                this.gotoX = this.x;
                this.gotoY = this.y;
            } else if (this.myTarget.type == "goblin hq" && this.lumber  == 0){
                nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees);
            } else if (this.distFrom(this.myTarget.x, this.myTarget.y) > UNIT_ATTACK_RANGE) {
                this.gotoX = this.myTarget.x;
                this.gotoY = this.myTarget.y;
                console.log("Go to location");
            } else {
                if(this.attackCoolDown <= 0) {
                    console.log("My Target is " + this.myTarget.type);
                    if (this.myTarget.type == "trees") {
                        this.lumber++;
                        this.myTarget.lumber--;
                        this.attackCoolDown = 600;
                        if (this.myTarget.lumber <= 0) {
                            this.myTarget.isDead = true;
                            soonCheckUnitsToClear();
                            this.myTarget == null;
                        }
                        if(this.lumber > 2){
                            this.myTarget == null;
                        }  
                    } else if (this.myTarget.type == "goblin hq"){
                        this.attackCoolDown = 60;
                        if (this.lumber > 0) {
                            this.lumber--;
                            this.myTarget.lumber++;
                            console.log("Lumber delivered: " + this.myTarget.lumber + " My Lumber: " + this.lumber);
                            if(this.lumber == 0){ //dropped off last piece of lumber
                              console.log("Last of lumber dropped off");
                              nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees);
                              this.myTarget = nearestTreeFound;
                            }
                        }
                    } else {
                        this.myTarget.health--;
                    }
                    this.showHealthBar = true;
                } else {
                    this.attackCoolDown--;
                }
                if (this.myTarget.health <= 0) {
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
            var nearestHQFound = null;
            var nearestOpponentFound = null;
            nearestOpponentFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_ORC_ATTACK_INITIATE, playerUnits);

            if(this.lumber <= 2 && this.jobType == "goblin" && nearestOpponentFound == null){
                nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees);
                this.myTarget = nearestTreeFound;
            } else if (this.lumber == 3 && this.jobType == "goblin") {
                nearestHQFound = findClosestUnitInRange(this.x,this.y,1000, buildingUnits);
                this.myTarget = nearestHQFound;
                this.attackCoolDown = 60;
            } else {
                this.myTarget = nearestOpponentFound;
                this.attackCoolDown = 60;
            }
                
            if(this.myTarget == null){
                this.gotoX = this.x - Math.random() * 70;
                this.gotoY = this.y - Math.random() * 70;
             
                this.keepInPlayableArea();
            }

            if (this.myTarget!=undefined && Math.random() < 0.02) {
                if(this.myTarget.type == "goblin hq" && this.jobType == "goblin"){
                    console.log(this.idNumber + " HQ + " + this.lumber)
                    if(this.lumber > 0){
                        nearestHQFound = findClosestUnitInRange(this.x,this.y,600, buildingUnits);
                        this.myTarget = nearestHQFound;
                        this.attackCoolDown = 60;
                    } else {
                        nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees);
                        this.myTarget = nearestTreeFound;
                    }
                } else if (this.myTarget.type == "trees" && this.jobType == "goblin"){
                    if(this.lumber > 2){
                        nearestHQFound = findClosestUnitInRange(this.x,this.y,5600, buildingUnits);
                        this.myTarget = nearestHQFound;
                    } else {
                        nearestTreeFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_TREE_RANGE, trees);
                        this.myTarget = nearestTreeFound;
                    }
                } else if (this.myTarget.type == "peasant"){
                    nearestOpponentFound = findClosestUnitInRange(this.x, this.y, UNIT_AI_ATTACK_INITIATE, playerUnits);
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
            if(this.walking){
                this.walkingAnimation();
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
            if (this.myTarget != null) {
                lineDraw(this.x, this.y, this.myTarget.x, this.myTarget.y, this.unitColor);
            }
        } else {
            colorCircle(this.x + 5, this.y, UNIT_PLACEHOLDER_RADIUS, "yellow", "10px Arial Black");
            //  colorText(this.iD, this.x+10, this.y-10, "yellow")
        }
    }
}