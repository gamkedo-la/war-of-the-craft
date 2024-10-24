var anyNewUnitsToClear = false;

function populateTeam(whichTeam,howMany,isPlayerControlled, type){
    
  var spawnUnit = null;

  for(var i=0;i<howMany;i++){
    if(type == "goblin" || 
      type == "orc" ||
      type == "peasant" ||
      type == "warrior" 
    ){
      spawnUnit = new unitClass(type);
    } else if (type == "players hq"){
      spawnUnit = new buildingClass("players hq");
    } else if (type == "goblins hq"){
      spawnUnit = new buildingClass("orc barrack");
    } else if (type == "orc barrack"){
      spawnUnit = new buildingClass("goblin hq");
    } else if (type == "peasant farm"){
      spawnUnit = new buildingClass("peasant farm");
    } else if (type == "orc farm"){
      spawnUnit = new buildingClass("orc farm");
    } else if (type == "trees"){
      spawnUnit = new environmentClass("trees");
    } else if (type == "mines"){
      spawnUnit = new environmentClass("mines");
    } else if (type == "wall"){
      spawnUnit = new buildingClass("wall");
    } else {
      console.log("Unidentified type:" + type);
    }

    if (spawnUnit) { 
      // make sure trees don't spawn on water!
      let validLocation = false;
      while (!validLocation) {
          spawnUnit.resetAndSetPlayerTeam(isPlayerControlled, i, type);
          let index = colRowToIndex (spawnUnit.x,spawnUnit.y);
          validLocation = presetUnwalkableTiles.indexOf(index)==-1;
      }
      addNewUnitToTeam(spawnUnit,whichTeam);   
      addUnitToGrid(spawnUnit);
    }
  }
}

function addNewUnitToTeam(spawnUnit,fightsForTeam){
  fightsForTeam.push(spawnUnit);
  allUnits.push(spawnUnit);
}

function findClosestUnitInRange(fromX,fromY,maxRange,inUnitList, type) {
  var nearestUnitDist = maxRange; 
  var nearestUnitFound = null;
  var unitlist;

  if (type) {
    unitlist = inUnitList.filter(function (item) {
      return item.type == type;
    })
  } else {
    unitlist = inUnitList;
  }

  for(var i=0;i<inUnitList.length;i++) {
    var distTo = inUnitList[i].distFromSq(fromX,fromY); 
    if(distTo < nearestUnitDist) {
      nearestUnitDist = distTo; 
      nearestUnitFound = inUnitList[i];
    }
  }
  // console.log(nearestUnitFound)
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

    
