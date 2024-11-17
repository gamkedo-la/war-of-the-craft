const AI_TEAM_THINK_DELAY_FRAMES = 30;

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

        if(playerUnits.length > 0){
            if(enemyUnits[this.indexEnemyToUpdate].myTarget != null){
                console.log(enemyUnits[this.indexEnemyToUpdate].jobType)
                if(enemyUnits[this.indexEnemyToUpdate].jobType == "goblin"){
                    if(enemyUnits[this.indexEnemyToUpdate].lumber == 0){
                        var nearestTreeFoundForPeasant = findClosestUnitInRange(enemyUnits[this.indexEnemyToUpdate].x, enemyUnits[this.indexEnemyToUpdate].y, UNIT_AI_TREE_RANGE, trees, trees);
                        enemyUnits[this.indexEnemyToUpdate].myTarget = nearestTreeFoundForPeasant;
                        enemyUnits[this.indexEnemyToUpdate].actionSx = 0;
                        enemyUnits[this.indexEnemyToUpdate].showAction = true;
                        enemyUnits[this.indexEnemyToUpdate].gotoNear(enemyUnits[this.indexEnemyToUpdate].myTarget.x,enemyUnits[this.indexEnemyToUpdate].myTarget.y, 0, 1);
                        enemyUnits[this.indexEnemyToUpdate].focus = "trees";
                        var goalTile = pixelCoordToIndex(enemyUnits[this.indexEnemyToUpdate].myTarget.x, enemyUnits[this.indexEnemyToUpdate].myTarget.y);
                        startPath(goalTile, enemyUnits[this.indexEnemyToUpdate]);
                    } 
                    if(enemyUnits[this.indexEnemyToUpdate].lumber > 0){
                        enemyUnits[this.indexEnemyToUpdate].returntoHQAction();
                    }
                } else {
                    enemyUnits[this.indexEnemyToUpdate].gotoNear(playerUnits[0].x, playerUnits[0].y,0,0);
                }
            }
        }

        this.indexEnemyToUpdate++;
    }
}