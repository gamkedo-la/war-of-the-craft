const AI_TEAM_THINK_DELAY_FRAMES = 90;

function enemyAITeamClass(){
    
    // start with a delay! this used to be 0, which meant all pathfinding would
    // delay the first frame of the game by several seconds. NOW, we wait until
    // the game is running before starting up the AI
    this.framesBetweenUpdates = 0;//AI_TEAM_THINK_DELAY_FRAMES;
    this.indexEnemyToUpdate = 0;
    
    this.setup = function(){
       // console.log("reached Setup");
     
    }

    this.update = function(){
        if(this.framesBetweenUpdates-- <= 0){
            this.framesBetweenUpdates = AI_TEAM_THINK_DELAY_FRAMES;
        } else {
            return;
        }

        //lumberAction(enemyUnits); // this can take 5 seconds...

       
        if(this.indexEnemyToUpdate >= enemyUnits.length){
            this.indexEnemyToUpdate = 0;
        }
        enemyUnits[this.indexEnemyToUpdate].gotoNear(playerUnits[0].x, playerUnits[0].y,0,0);
        this.indexEnemyToUpdate++;
    }
}