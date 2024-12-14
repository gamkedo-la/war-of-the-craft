var anyNewUnitsToClear = false;

function populateTeam(whichTeam,howMany,isPlayerControlled, type){
    
  var spawnUnit = null;
  let debugInvalidPositionsSkipped = 0;

  for(var i=0;i<howMany;i++){
    if(type == "goblin" || 
      type == "orc" ||
      type == "peasant" ||
      type == "warrior" 
    ){
      spawnUnit = new unitClass(type);
    } else if (type == "players hq"){
      spawnUnit = new buildingClass("players hq");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "goblins hq"){
      spawnUnit = new buildingClass("goblins hq");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "orcs barracks"){
      spawnUnit = new buildingClass("orc barracks");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "peasant farm"){
      spawnUnit = new buildingClass("peasant farm");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "tower"){
      spawnUnit = new buildingClass("tower");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "orc farm"){
      spawnUnit = new buildingClass("orc farm");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "trees"){
      spawnUnit = new environmentClass("trees");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "mines"){
      spawnUnit = new environmentClass("mines");
      pathfindingGridDataNeedsRefreshing = true;
    } else if (type == "wall"){
      spawnUnit = new buildingClass("wall");
      pathfindingGridDataNeedsRefreshing = true;
    } else {
      console.log("Unidentified type:" + type);
    }

    if (spawnUnit) { 
      // make sure trees don't spawn on water!
      let validLocation = false;
      while (!validLocation) {
          spawnUnit.resetAndSetPlayerTeam(isPlayerControlled, i, type);
          // hmm this does not seem to set position yet??  ----^
          validLocation = !isPixelCoordinateInsideAnUnwalkableTile(spawnUnit.x,spawnUnit.y);
          if (!validLocation) debugInvalidPositionsSkipped++;
      }
      addNewUnitToTeam(spawnUnit,whichTeam);   
      addUnitToGrid(spawnUnit);
    }
  }

  //just to confirm we are not spawning trees on water
  console.log("populateTeam finished spawning "+howMany+" "+type+"s. Avoided "+debugInvalidPositionsSkipped+" unwalkable tiles.");
}

function addNewUnitToTeam(spawnUnit,fightsForTeam){
  fightsForTeam.push(spawnUnit);
  allUnits.push(spawnUnit);
}

// returns a single unit
function findClosestUnitInRange(fromX,fromY,maxRange,inUnitList,type) {
  var nearestUnitDist = maxRange; 
  var nearestUnitFound = null;
  var unitlist;

  if (type) {
    // extract only the units of the correct type
    unitlist = inUnitList.filter(function (item) { return item.type == type; })
  } else {
    // use all units in provided list
    unitlist = inUnitList;
  }

  for(var i=0;i<unitlist.length;i++) {
    var distTo = unitlist[i].distFrom(fromX,fromY); //does this take a lot of performance? (answer:NO)
    if(distTo < nearestUnitDist) {
      nearestUnitDist = distTo; 
   //   console.log("Dist: " + nearestUnitDist);
      nearestUnitFound = unitlist[i];
    }
  }
  // console.log(nearestUnitFound)
  return nearestUnitFound;
}

function findClosestFriendlyBuildingInRange(fromX,fromY,maxRange,inUnitList, type, team) {
  var nearestUnitDist = maxRange; 
  var nearestUnitFound = null;
  var unitlist;
  var team = team;

  if (type) {
    unitlist = inUnitList.filter(function (item) {
      return item.type == type;
    })
  } else {
    unitlist = inUnitList;
  }

  for(var i=0;i<unitlist.length;i++) {
    var distTo = unitlist[i].distFrom(fromX,fromY); 
    if(unitlist[i].unitColor == team){
      //console.log(unitlist[i].unitColor)
      if(distTo < nearestUnitDist) {
        nearestUnitDist = distTo; 
        nearestUnitFound = unitlist[i];
      }
    } 
  }
  // console.log(nearestUnitFound)
  return nearestUnitFound;
}
    
function removeDeadUnitsFromList(fromArray) {
  for(var i=fromArray.length - 1; i>=0; i--){ 
    if(fromArray[i].isDead) {
        // draw a stump/skeleton/bloodstain/rubble on the floor overlay if specified
        if (fromArray[i].deadSprite) {
            wildflowers.drawTerrainDecal(fromArray[i].x-10,fromArray[i].y-10,fromArray[i].deadSprite,1);
        }
        // now forget about this unit forever
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

    
