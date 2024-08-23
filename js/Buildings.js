function buildingClass(building) {
    this.type = building;

    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        this.x = Math.random()*canvas.width/4 + 50;
        this.y = Math.random()*canvas.height/4 + 50;
        
  
        this.width = 100;
        this.height = 100;
        this.pic = goblinHQPic;
        this.lumber = 0;

        if(this.type == "players hq") {
            this.x = canvas.width/4 - this.x;
            this.y = canvas.height/4 - this.y;
            this.pic = humanHQPic;
            this.sX = 0;
            this.sY = 0;
            this.unitColor = 'Red';
            this.health = 50;
        } else if (this.type == "goblin hq") {
            this.x = canvas.width - this.x;
            this.y = canvas.height - this.y;
            this.sX = 0;
            this.sY = 0;
            this.unitColor = 'White';
            this.pic = goblinHQPic;
            this.health = 50;
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