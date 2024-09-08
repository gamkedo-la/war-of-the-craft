var anyNewUnitsToClear = false;

function populateTeam(whichTeam,howMany,isPlayerControlled, type){
    for(var i=0;i<howMany;i++){
      if(type == "goblin" || 
         type == "orc" ||
         type == "peasant" ||
         type == "warrior"
      ){
        var spawnUnit = new unitClass(type);
      } else if (type == "players hq"){
        var spawnUnit = new buildingClass("players hq");
      } else if (type == "goblins hq"){
        var spawnUnit = new buildingClass("orc barrack");
      } else if (type == "orc barrack"){
        var spawnUnit = new buildingClass("goblin hq");
      } else if (type == "peasant farm"){
        var spawnUnit = new buildingClass("peasant farm");
      } else if (type == "orc farm"){
        var spawnUnit = new buildingClass("orc farm");
      } else if (type == "trees"){
        var spawnUnit = new environmentClass("trees");
      } else if (type == "mines"){
        var spawnUnit = new environmentClass("mines");
      } 

      spawnUnit.resetAndSetPlayerTeam(isPlayerControlled, i, type);
      addNewUnitToTeam(spawnUnit,whichTeam);   
      addUnitToGrid(spawnUnit);
    }
}

function addNewUnitToTeam(spawnUnit,fightsForTeam){
    fightsForTeam.push(spawnUnit);
    allUnits.push(spawnUnit);
}

function findClosestUnitInRange(fromX,fromY,maxRange,inUnitList) {
    var nearestUnitDist = maxRange; 
    var nearestUnitFound = null;

    for(var i=0;i<inUnitList.length;i++) {
        var distTo = inUnitList[i].distFromSq(fromX,fromY); 
        if(distTo < nearestUnitDist) {
            nearestUnitDist = distTo; 
            nearestUnitFound = inUnitList[i];
        }
    }
    return nearestUnitFound;
}
    
function removeDeadUnitsFromList(fromArray) {
    for(var i=fromArray.length - 1; i>=0; i--){ 
        if(fromArray[i].isDead) {
            fromArray.splice(i,1);
        }
    }
}

function checkAndHandleVictory() {
    if(playerUnits.length == 0 && enemyUnits.length == 0) { 
        document.getElementById("debugText").innerHTML = "IT'S... A... DRAW?";
    } else if(playerUnits.length == 0) { 
        document.getElementById("debugText").innerHTML = "ENEMY TEAM WON";
    } else if(enemyUnits.length == 0) { 
        document.getElementById("debugText").innerHTML = "PLAYER TEAM WON";
    }
}
    
function removeDeadUnits() {
    if(anyNewUnitsToClear){
        removeDeadUnitsFromList(allUnits); 
        removeDeadUnitsFromList(playerUnits); 
        removeDeadUnitsFromList(enemyUnits); 
        removeDeadUnitsFromList(buildingUnits);
        removeDeadUnitsFromList(trees);
        removeDeadUnitsFromList(mines);
        removeDeadUnitsFromList(selectedUnits);
        anyNewUnitsToClear = false;
    }
}

function soonCheckUnitsToClear() { 
    anyNewUnitsToClear = true;
    refreshCollisionGrid();
}

    