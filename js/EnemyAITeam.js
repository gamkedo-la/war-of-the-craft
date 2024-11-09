const AI_TEAM_THINK_DELAY_FRAMES = 30;

function enemyAITeamClass(){
    this.framesBetweenUpdates = 0;
    
    this.setup = function(){
       // console.log("reached Setup");
     
    }

    this.update = function(){
        if(this.framesBetweenUpdates-- <= 0){
            this.framesBetweenUpdates = AI_TEAM_THINK_DELAY_FRAMES;
        } else {
            return;
        }

        lumberAction(enemyUnits);

        for(var i=0;i<enemyUnits.length;i++) {
           // enemyUnits[i].gotoNear(playerUnits[0].x, playerUnits[0].y,0,0);
           
        }
    }
}