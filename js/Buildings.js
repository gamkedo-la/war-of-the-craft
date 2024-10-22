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
        this.height = 100;
        this.pic = goblinHQPic;
        this.lumber = 0;
        this.sX = 0;
        this.sY = 0;
        this.health = 50;
        this.unitColor = 'White';
        this.minimapDrawPriority = 1;
    
        const adjustForComputer = () => {
            this.x = WORLD_SIZE_PIXELS_W - this.x - 900;
            this.y = WORLD_SIZE_PIXELS_H - this.y - 900;
        };
    
        switch (this.type) {
            case "players hq":
                this.pic = humanHQPic;
                this.unitColor = 'Red';
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
                this.x = mouseX;
                this.y = mouseY;
                this.height = 60;
                this.sy = 50;
                this.pic = orcFarmPic;
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
    };

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

    this.move = function(){
        //don't move building
    }

    this.determineWallPosition = function(){
        
    }

    this.draw = function(){
        drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY,this.width,this.height, this.x,this.y);
    }
    this.drawOnMinimap = function(x,y){
        colorRect(x, y, Math.max(1,this.width / MINIMAPXRELATIVESIZE), Math.max(1,this.height / MINIMAPYRELATIVESIZE), "rgba(0,0,0,1)");//this.unitColor);
    }
}