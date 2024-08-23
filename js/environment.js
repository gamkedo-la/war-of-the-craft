function environmentClass(environmentType) {
    this.isDead = false;
    this.type = environmentType;

    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        for(var i = 0; i<buildingUnits.length; i++){
            var isTreeCloseToBuilding = this.distFrom(buildingUnits[i].x, buildingUnits[i].y);
            if(isTreeCloseToBuilding < 70){
                this.isDead = true;
                anyNewUnitsToClear = true;
            }
        }
        for(var i = 0; i<mines.length; i++){
            var isTreeCloseToMines = this.distFrom(mines[i].x, mines[i].y);
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
        } else if (this.type == "mines"){
            this.mineVariances = 1;
            this.pic = minePic;
            this.width = 50;
            this.height = 45;
            this.sY = 0;
            this.sX = returnRandomInteger(this.mineVariances) * this.width;
            this.gold = 25;
            }
    }

    this.distFrom = function(otherX, otherY) {
        var deltaX = otherX-this.x;
        var deltaY = otherY-this.y;
        return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      }

    this.move = function(){
        //don't move building
    }

    this.draw = function(){
        drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY,this.width,this.height, this.x,this.y);
    }
}