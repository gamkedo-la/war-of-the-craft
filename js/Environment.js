function environmentClass(environmentType) {
    this.isDead = false;
    this.type = environmentType;
    this.collFill = .5; 
    this.collDim = 1;

    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        
        // ensure the unit is not standing on water etc
        let validLocation = false;
        while (!validLocation) {
            this.x = Math.random()*WORLD_SIZE_PIXELS_W;
            this.y = Math.random()*WORLD_SIZE_PIXELS_H;
            let index = colRowToIndex (this.x,this.y);
            validLocation = presetUnwalkableTiles.indexOf(index)==-1;
        }

        for(var i = 0; i<buildingUnits.length; i++){
            var isTreeCloseToBuilding = this.distFromSq(buildingUnits[i].x, buildingUnits[i].y);
            if(isTreeCloseToBuilding < 70){
                this.isDead = true;
                anyNewUnitsToClear = true;
            }
        }
        for(var i = 0; i<mines.length; i++){
            var isTreeCloseToMines = this.distFromSq(mines[i].x, mines[i].y);
            if(isTreeCloseToMines < 50){
                this.isDead = true;
                anyNewUnitsToClear = true;
            }
        }
        if(this.type == "trees"){
            this.treeVariances = 4;
            this.pic = treePic;
            this.width = 15;
            this.height = 20;
            this.sY = 0;
            this.sX = returnRandomInteger(this.treeVariances) * this.width;
            this.lumber = 1;
            this.minimapDrawPriority = 10;
        } else if (this.type == "mines"){
            this.mineVariances = 1;
            this.pic = minePic;
            this.width = 50;
            this.height = 45;
            this.sY = 0;
            this.sX = returnRandomInteger(this.mineVariances) * this.width;
            this.gold = 25;
            this.minimapDrawPriority = 9;
            }
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

    this.draw = function(){
        drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY,this.width,this.height, this.x,this.y);
    }
    this.drawOnMinimap = function(x,y){
        colorRect(x, y, this.width / MINIMAPXRELATIVESIZE, this.height / MINIMAPYRELATIVESIZE, 'Green');    
    }
}