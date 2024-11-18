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

    this.update = function () {
        // Decrement frame counter and return early if not time to update
        if (this.framesBetweenUpdates-- > 0) return;
    
        this.framesBetweenUpdates = AI_TEAM_THINK_DELAY_FRAMES;
    
        // Reset index if it exceeds the array length
        if (this.indexEnemyToUpdate >= enemyUnits.length) {
            this.indexEnemyToUpdate = 0;
        }
    
        // Return early if there are no player units
        if (playerUnits.length === 0) return;
    
        var enemy = enemyUnits[this.indexEnemyToUpdate];
    
        // Skip if enemy has no target
        if (!enemy.myTarget) {
            this.indexEnemyToUpdate++;
            return;
        }
    
        console.log(enemy.jobType);
    
        if (enemy.jobType == "goblin") {
            if (enemy.lumber == 0) {
                // Find the nearest tree and assign it as a target
                const nearestTree = findClosestUnitInRange(enemy.x, enemy.y, UNIT_AI_TREE_RANGE, trees, trees);
                if (nearestTree) {
                    enemy.myTarget = nearestTree;
                    enemy.actionSx = 0;
                    enemy.showAction = true;
                    enemy.gotoNear(nearestTree.x, nearestTree.y, 0, 1);
                    enemy.focus = "trees";
    
                    const goalTile = pixelCoordToIndex(nearestTree.x, nearestTree.y);
                    startPath(goalTile, enemy);
                }
            } else {
                enemy.returntoHQAction();
            }
        } else {
            // Non-goblin enemies move toward the first player unit
            const player = playerUnits[0];
            enemy.gotoNear(player.x, player.y, 0, 0);
        }

        this.indexEnemyToUpdate++;
    }
}