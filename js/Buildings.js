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
        this.ticksPerBuildingTime = 1000;
        this.buildingTime = this.ticksPerBuildingTime;
        this.buildingInProgress = false;
        this.health = 50;
        this.unitColor = 'White';
        this.minimapDrawPriority = 1;
        this.totalBuildStages = 3;
        this.totalTime;
    
        const adjustForComputer = () => {
            this.x = WORLD_SIZE_PIXELS_W - this.x - 900;
            this.y = WORLD_SIZE_PIXELS_H - this.y - 900;
        };
    
        switch (this.type) {
            case "players hq":
                this.pic = humanHQPic;
                this.unitColor = 'Red';
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
                this.unitColor = 'Red';
                this.health = 50;
                this.minimapDrawPriority = 3;
                this.snapNearestGridCenter();
                break;
            case "peasant farm":
                console.log("Farm Built");
                this.x = mouseX + camera.x;
                this.y = mouseY + camera.y;
                this.height = 60;
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
                this.sy = 0;
                this.pic = towerPic;
                this.health = 10;
                this.minimapDrawPriority = 2;
                break;
            //Computer buildings
            case "goblin hq":
                adjustForComputer();
                this.pic = goblinHQPic;
                break;
            case "orc barrack":
                adjustForComputer();
                this.pic = orcBarrackPic;
                this.minimapDrawPriority = 2;
                break;
            case "orc farm":
                adjustForComputer();
                this.height = 50;
                this.pic = orcFarmPic;
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

    this.startToBuild = function(){
        this.buildingTime--;
        if(this.buildingTime <= 0){
            this.buildingTime = this.ticksPerBuildingTime;
            this.buildingStage++;
            if(this.buildingStage == this.totalBuildStages){
                this.buildingInProgress = false;
            }
        }
        this.currentTime = (this.buildingStage*this.ticksPerBuildingTime)+(this.ticksPerBuildingTime - this.buildingTime);
        this.totalTime = this.ticksPerBuildingTime * (this.totalBuildStages+1)
        this.percentComplete = (this.currentTime/this.totalTime).toFixed(2);
        console.log("Current: " + this.percentComplete);
    }

    this.move = function(){
        if(this.buildingInProgress){
            this.startToBuild();
        }
    }

    this.determineWallPosition = function(){
        
    }

    this.drawProgressBar = function(){
        var fillWidth = this.width * this.percentComplete;
        colorRect(this.x-this.width/2, this.y-this.height/2 - 10, this.width, 10, "black")
        colorRect(this.x-this.width/2, this.y-this.height/2 - 10, fillWidth, 10, "yellow") 
    }

    this.draw = function(){
        this.sY = this.height * this.buildingStage;
        drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY,this.width,this.height, this.x,this.y);
        if(this.buildingInProgress){
            this.drawProgressBar();
        }
    }

    this.drawOnMinimap = function(x,y){
        colorRect(x, y, Math.max(1,this.width / MINIMAPXRELATIVESIZE), Math.max(1,this.height / MINIMAPYRELATIVESIZE), "rgba(0,0,0,1)");//this.unitColor);
    }
}