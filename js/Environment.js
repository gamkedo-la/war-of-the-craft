function environmentClass(environmentType) {
    this.isDead = false;
    this.type = environmentType;
    this.collFill = .5; 
    this.collDim = 1;

    this.resetAndSetPlayerTeam = function(playerTeam, idNumber) {
        // Ensure the unit is not standing on water, etc.
        let validLocation = false;
        while (!validLocation) {
            this.x = Math.random() * WORLD_SIZE_PIXELS_W;
            this.y = Math.random() * WORLD_SIZE_PIXELS_H;
            let index = colRowToIndex(this.x, this.y);
            validLocation = presetUnwalkableTiles.indexOf(index) === -1;
        }
    
        // Proximity check for units
        var checkProximity = function(units, threshold) {
            for (var i = 0; i < units.length; i++) {
                if (this.distFromSq(units[i].x, units[i].y) < threshold) {
                    this.isDead = true;
                    anyNewUnitsToClear = true;
                    return;
                }
            }
        }.bind(this); 
    
        checkProximity(buildingUnits, 70);
        checkProximity(mines, 50);

        var configureUnit = function(variances, pic, width, height, sY, resourceKey, resourceValue, minimapPriority, effort, total) {
            this[resourceKey] = resourceValue;
            this.pic = pic;
            this.width = width;
            this.height = height;
            this.sY = sY;
            this.sX = returnRandomInteger(variances) * this.width;
            this.minimapDrawPriority = minimapPriority;
            this.effort = effort;
            this.total = total;
        }.bind(this); // Explicitly bind 'this' here too
    
        if (this.type == "trees") {
            configureUnit(4, treePic, 15, 20, 0, 'lumber', 1, 10, 100, 1);
        } else if (this.type == "mines") {
            configureUnit(1, minePic, 50, 45, 0, 'gold', 25, 9, 50, 1000);
        }
    };
    
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
        if(!this.isDead){
            drawBitmapCenteredAtLocation(this.pic, this.sX, this.sY,this.width,this.height, this.x,this.y);
        }
    }
    this.drawOnMinimap = function(x,y){
        if(!this.isDead){
            colorRect(x, y, Math.max(1,this.width / MINIMAPXRELATIVESIZE), Math.max(1,this.height / MINIMAPYRELATIVESIZE), 'Green');    
        }
    }
}