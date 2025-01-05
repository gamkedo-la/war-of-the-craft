const AI_TEAM_THINK_DELAY_FRAMES = 30;
const AI_TEAM_POSITION_VARIATION_X = 250;
const AI_TEAM_POSITION_VARIATION_Y = 250;
const AI_TEAM_MISTAKE_PROBABILITY = 0; //Percantage
var orcWarningPlayed = false;
var enemyFarmBuilt = 0;
var goblinFocus = "trees"

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
        if (!enemy || !enemy.myTarget) {
            this.indexEnemyToUpdate++;
            return;
        }

        // Enemy can forget to make any progress with units
       // var numberBetween0and100 =  Math.floor(Math.random() * (100 - 0)) + 0;
       // if (numberBetween0and100 <= AI_TEAM_MISTAKE_PROBABILITY) {
       //     this.indexEnemyToUpdate++;
       //     return;
      //  }

        // Give some variation to enemy position.
        // So that it might find a not optimal target instead of finding the closest.
        var maxVariationX = enemy.x + AI_TEAM_POSITION_VARIATION_X;
        var minVariationX = enemy.x - AI_TEAM_POSITION_VARIATION_X;
        var maxVariationY = enemy.y + AI_TEAM_POSITION_VARIATION_Y;
        var minVariationY = enemy.y - AI_TEAM_POSITION_VARIATION_Y;
        var enemyPositionX =  Math.floor(Math.random() * (maxVariationX - minVariationX)) + minVariationX;
        var enemyPositionY =  Math.floor(Math.random() * (maxVariationY - minVariationY)) + minVariationY;
        //console.log( enemyPositionX + " " + enemyPositionY);

        //build and recruit options
        if(enemyWoodAvailable < 1 && enemyFarmBuilt == 0){ //10
            goblinFocus = "trees";
        } else if(enemyWoodAvailable >= 1 && enemyFarmBuilt == 0){ //10, 0
            console.log("build farm")
            populateTeam(buildingUnits,1,false, "orc farm");
            enemyWoodConsumed += 10;
            enemyFarmBuilt++;
            goblinFocus = "gold";
        } else if(enemyGoldAvailable < 2 && enemyFarmBuilt >= 1){
            goblinFocus = "gold";
        } else if(enemyGoldAvailable >= 1){
            enemyGoldConsumed =+ 1;
            populateTeam(enemyUnits, 1, false, "goblin");
            goblinFocus = "food"
        }
        
        if (enemy.jobType === "goblin") {
            const isFocusingOnTrees = goblinFocus === "trees";
            const isFocusingOnGold = goblinFocus === "gold";
       //     console.log("isFocusingOnTrees: " + isFocusingOnTrees + " isFocusingOnGold: " + isFocusingOnGold)
            if (isFocusingOnTrees) {
                if (enemy.lumber === 0) {
                    // Find the nearest tree and assign it as a target
                    const nearestTree = findClosestUnitInRange(enemy.x, enemy.y, UNIT_AI_TREE_RANGE, trees);
                    assignGoblinTarget(enemy, nearestTree, "trees");
      //              console.log("Focus is on Wood");
                } else if (enemy.lumber > 0) {
                    enemy.returntoHQAction();
                }
            } else if (isFocusingOnGold) {
            //    console.log(enemy.gold)
                if (enemy.gold === 0) {
                    // Find the nearest mine and assign it as a target
                    const nearestMine = findClosestUnitInRange(enemy.x, enemy.y, UNIT_AI_MINE_RANGE, mines);
           //         console.log("Focus is on Gold:" + nearestMine);
                    enemy.actionSx = 15 * 2;
                    assignGoblinTarget(enemy, nearestMine, "mines");
                } else if (enemy.gold > 0) {
                    enemy.returntoHQAction();
                }
            }
        } else if (enemy.jobType == 'orc') {
            // Orc patrol until player is found, then assign player as a target
            let closestTarget = findClosestUnitInRange(enemy.x,enemy.y,20000, playerUnits);
            if(closestTarget != null){
                let playerTile = pixelCoordToIndex(closestTarget.x, closestTarget.y);
                startPath(playerTile, enemy);
                console.log("Orc found player, and moving towards.")
                if(!orcWarningPlayed){
                    orcWarningSound.play();
                    orcWarningPlayed = true;
                }
                enemy.patroling = false;
            } else {
                if(enemy.patroling == false){
                    console.log("No target, Orc Patroling");
                    let randomTileX = returnRandomInteger(WORLD_SIZE_PIXELS_W);
                    let randomTileY = returnRandomInteger(WORLD_SIZE_PIXELS_H);
                    let randomTile = pixelCoordToIndex(randomTileX, randomTileY);
                    startPath(randomTile, enemy);
                    enemy.patroling = true;
                } else {
                    return;
                }
            }
        }
        
        this.indexEnemyToUpdate++;
    }
}

function assignGoblinTarget(enemy, target, focus) {
    if (target) {
        enemy.myTarget = target;
        enemy.actionSx = 0;
        enemy.showAction = true;
        enemy.gotoNear(target.x, target.y, 0, 1);
        enemy.focus = focus;
    //    console.log(enemy.focus)
    }
}