var allKnownPlayerHQs = []; // to quickly add up resources for the scoreboard and purchasing

function checkForBuildingSelected(){
    for(var i = 0; i < buildingUnits.length; i++){
        var buildingSelected = buildingUnits[i].isInBox();
        if(buildingSelected){
            selectedUnits = [];
            peasantSelected = false;
            warriorSelected = false;
            headQuartersUI = true;
        }
    }
}

function countPlayerGold() {
    var total = 0;
    for (nextone of allUnits)  {
        if (nextone.type == "players hq") {
            //console.log("debug: counting gold - hq found!",nextone);
            if (nextone.gold) total += nextone.gold;
        }
    }
    return total;
}
function countPlayerFood() {
    var total = 0;
    for (nextone of allUnits)  {
        if (nextone.type == "players hq") {
            if (nextone.food) total += nextone.food;
        }
    }
    return total;
}
function countPlayerWood() {
    var total = 0;
    for (nextone of allUnits)  {
        if (nextone.type == "players hq") {
            if (nextone.lumber) total += nextone.lumber;
        }
    }
    return total;
}

function buildingClass(building) {
    this.type = building;
    this.collFill = 1;
    this.collDim = 2;
    
    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        // ensure the unit is not standing on water etc
        let validLocation = false;
        while (!validLocation) {
            this.x = Math.random() * WORLD_SIZE_PIXELS_W;
            this.y = Math.random() * WORLD_SIZE_PIXELS_H;
            let index = colRowToIndex(this.x, this.y);
            validLocation = presetUnwalkableTiles.indexOf(index) === -1;
        }
    
        this.width = 100;
        this.height = 110;
        this.pic = goblinHQPic;
        this.lumber = 0;
        this.sX = 0;
        this.sY = 0;
        this.buildingStage = 0;
        this.ticksPerBuildingTime = 50; //adjust to 1000 or another time
        this.buildingTime = this.ticksPerBuildingTime;
        this.buildingInProgress = false;
        this.health = 50;
        this.unitColor = 'White';
        this.minimapDrawPriority = 1;
        this.totalBuildStages = 3;
        this.progressSX = 0;
        this.totalTime = this.ticksPerBuildingTime * (this.totalBuildStages + 1);
    
        const adjustForComputer = () => {
            this.x = WORLD_SIZE_PIXELS_W - this.x - 900;
            this.y = WORLD_SIZE_PIXELS_H - this.y - 900;
        };
    
        switch (this.type) {
            case "players hq":
                this.pic = humanHQPic;
                this.unitColor = 'White';
                this.x = playerUnits[0].x - 40;
                this.y = playerUnits[0].y - 30;
                break;
            case "wall":
                this.x = mouseX;
                this.y = mouseY;
                this.width = 32;
                this.height = 32;
                this.pic = wallPic;
                this.sX = 32 * 3;
                this.unitColor = 'White';
                this.health = 50;
                this.minimapDrawPriority = 3;
                this.snapNearestGridCenter();
                break;
            case "peasant farm":
                console.log("Farm Built");
                this.x = mouseX + camera.x;
                this.y = mouseY + camera.y;
                this.height = 60;
                this.unitColor = 'White';
                this.sy = 0;
                this.pic = orcFarmPic;
                this.health = 10;
                this.minimapDrawPriority = 2;
                break;
            case "tower":
                console.log("Tower Built");
                this.x = mouseX + camera.x;
                this.y = mouseY + camera.y;
                this.height = 90;
                this.width = 100;
                this.unitColor = 'White';
                this.sy = 0;
                this.pic = towerPic;
                this.health = 10;
                this.minimapDrawPriority = 2;
                break;
            //Computer buildings
            case "goblins hq":
                adjustForComputer();
                this.pic = goblinHQPic;
                this.unitColor = "Red";
                break;
            case "orc barrack":
                adjustForComputer();
                this.pic = orcBarrackPic;
                this.unitColor = "Red";
                this.minimapDrawPriority = 2;
                break;
            case "orc farm":
                adjustForComputer();
                this.height = 50;
                this.pic = orcFarmPic;
                this.unitColor = "Red";
                this.health = 10;
                this.minimapDrawPriority = 2;
                break;
            default:
                console.warn(`Unknown type: ${this.type}`);
        }
    }

    this.isInBox = function() {
        var leftX = this.x;
        var rightX = this.x + this.width;
        var topY = this.y;
        var bottomY = this.y + this.height;
        var clickX = mouseX + camera.x;
        var clickY = mouseY + camera.y;

        return (clickX >= leftX && clickX <= rightX && clickY >= topY && clickY <= bottomY);
    }

    this.snapNearestGridCenter = function (){
        this.x = Math.floor(this.x/GRID_WIDTH)*GRID_WIDTH + GRID_WIDTH/2;
        this.y = Math.floor(this.y/GRID_HEIGHT)*GRID_HEIGHT + GRID_HEIGHT/2;
    }

    this.distFrom = function(otherX, otherY) {
        var deltaX = otherX-this.x;
        var deltaY = otherY-this.y;
        return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    }

    this.distFromSq = function(otherX, otherY) { //return square distance faster for comparison, not accuracy
        var deltaX = otherX-this.x;
        var deltaY = otherY-this.y;
        return deltaX*deltaX + deltaY*deltaY;
    } 



    this.startToBuild = function() {
        this.buildingTime--;
        console.log(this.buildingTime)
        //var advanceProgressSX = this.ticksPerBuildingTime/3
        /*if( this.buildingTime == advanceProgressSX*2 || 
            this.buildingTime == advanceProgressSX ){
            this.progressSX = this.progressSX + 50;
        } */

        if (this.buildingTime <= 0) {
            this.buildingTime = this.ticksPerBuildingTime;
            this.buildingStage++;
            this.progressSX = this.progressSX + 50;
            
            if (this.buildingStage >= this.totalBuildStages) {
                this.buildingInProgress = false;
                if(this.type == "tower"){
                peasantTowerCompletedSound.play();
                } else if(this.type == "peasant farm") {
                peasantFarmCompletedSound.play();
                }
            }
        }
    }

    this.move = function(){
        if(this.buildingInProgress){
            this.startToBuild();
        }
    }

    this.determineWallPosition = function(){
        
    }

    this.draw = function(){
        this.sY = this.height * this.buildingStage;
        drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY,this.width,this.height, this.x,this.y);
      /*  if(this.buildingInProgress){
          drawBitmapCenteredAtLocation(healthBarPic, this.progressSX, 9,50,13, this.x,this.y);
        } */
    }

    this.drawOnMinimap = function(x,y){
        let BOLD = 1; // draw extra big for clarity
        colorRect(x, y, Math.max(1,this.width / MINIMAPXRELATIVESIZE)+BOLD, Math.max(1,this.height / MINIMAPYRELATIVESIZE)+BOLD, "rgba(0,0,0,1)");//this.unitColor);
    }
}