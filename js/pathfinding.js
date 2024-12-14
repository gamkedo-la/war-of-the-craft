// this lets us reuse previously created grid data
// so set this to TRUE if the world changes (new buildings)
// to force a fresh data gathering step
const PATHFINDING_REUSES_GRID_UNLESS_REFRESHED = true; // true, use the variable below, not sure we can make each unit a recalculated grid.
var pathfindingGridDataNeedsRefreshing = true; // set to true calculate grid
const USE_FASTER_ARRAYREMOVE = true; // set to true for faster but maybe buggy version

var unvisitedList = [];
const TILE_WATER = 2; //Temp used for unwalkable tile
const TILE_GOAL = 3; //Temp used for end tile

function SetupPathfindingGridData(whichPathfinder) {
    var endR = -1;
    var endC = -1;

    unvisitedList = [];
	  var pathfinder = whichPathfinder;
    //console.log("Pathfinder: " + pathfinder)


  /*  //code below isn't currently hooked to anything.  Do we need it?
    if(grid.length > 0) { // non-zero, copy over player set walls into tileGrid for reset
        for (var eachCol = 0; eachCol < GRID_COLUMNS; eachCol++) {
            for (var eachRow = 0; eachRow < GRID_ROWS; eachRow++) {
                var idxHere = tileCoordToIndex(eachCol, eachRow);
                if(grid[idxHere].elementType == VISITED ||
                    grid[idxHere].elementType == PATH) {
                   // tileGrid[idxHere] = NOTHING;
                } else {
                    //tileGrid[idxHere] = grid[idxHere].elementType;
                }
            }
        }
    } */
    if(grid.length > 0){
      //console.log("Trying to reuse Grid... this is new, may have bugs", grid.length);
      for(var i = 0; i < grid.length; i++){
       // grid[i].pathfinder = pathfinder;
        grid[i].setup(grid[i].tilC, grid[i].tilR, grid[i].tilIdx, collGrid[i], pathfinder);
        unvisitedList.push( grid[i] );
      }
    } else {
      grid = [];

      for (var eachCol = 0; eachCol < GRID_COLUMNS; eachCol++) {
          for (var eachRow = 0; eachRow < GRID_ROWS; eachRow++) {
              var idxHere = tileCoordToIndex(eachCol, eachRow);

              grid[idxHere] = new GridElement();
              grid[idxHere].name = "" + eachCol + "," + eachRow;
              grid[idxHere].idx = idxHere;
              grid[idxHere].pathfinder = pathfinder;
              unvisitedList.push( grid[idxHere] );

              grid[idxHere].setup(eachCol, eachRow, idxHere, collGrid[idxHere], pathfinder);

              //if(grid[idxHere].elementType == DEST) { ///// found end!
              if(grid[idxHere].elementType == TILE_GOAL) { ///// found end!
                  //Note, doesn't appear to be used in this program
                  endR = eachRow; ///// save tile coords for use with
                  endC = eachCol; ///// computing h value of each tiles
              } /////
          }
      }
    }   
    
    ///// different pass now that endR and endC are set, find h
    for (var eachCol = 0; eachCol < GRID_COLUMNS; eachCol++) { /////
        for (var eachRow = 0; eachRow < GRID_ROWS; eachRow++) { /////
            var idxHere = tileCoordToIndex(eachCol, eachRow); /////

            grid[idxHere].hVal =  /////
              hValCal(eachCol, eachRow, endC,endR, 3, true); /////
        } /////
    } /////

    pathfindingGridDataNeedsRefreshing = false; // reuse it next time!
}

function hValCal(atColumn,atRow, toColumn,toRow, multWeight, geometric) { /////
  var diffC = atColumn - toColumn;
  var diffR = atRow - toRow;
  var geo = geometric;

  if(geo){
	return multWeight * Math.sqrt( diffC*diffC + diffR*diffR ); // geometric dist.
  } else {
    return multWeight * (Math.abs(diffC) + Math.abs(diffR)); ///// manhatten streets
  }
}

function startPath(toTile, pathFor){
	
    console.log("starting pathfinding...");
    console.time("pathfinding took"); // start a debug timer

    if (toTile< 0 || toTile >= collGrid.length) { // invalid or off board
        console.log("Not a valid location");
		return;
    }
	
	if (pathfindingGridDataNeedsRefreshing || !PATHFINDING_REUSES_GRID_UNLESS_REFRESHED) { 
        SetupPathfindingGridData(pathFor);
    }
	grid[toTile].setGoal();
	PathfindingNextStep(pathFor);

    console.timeEnd("pathfinding took"); // end the debug timer and say how long it look

}

function PathfindingNextStep(whichPathfinder) {
  var tentativeDistance = 0;
	var pathfinder = whichPathfinder;
	var safetyBreak = 50000;
	var endTile = null;

      while(unvisitedList.length > 0 && safetyBreak-- > 0) { //// "while Q is not empty:"
        //// "u := vertex in Q with min dist[u]"
        var currentTile = null;
        var currentTileIndex = -1;
        var ctDistWithH; ///// a* with hVal heuristic added
        //console.log(unvisitedList.length);
        for (var i=0; i < unvisitedList.length; i++) {
          var compareTile = unvisitedList[i];
        
          if(currentTile == null || compareTile.distance + compareTile.hVal < ctDistWithH) { /////
            currentTile = compareTile;
            currentTileIndex = i;
            ctDistWithH = currentTile.distance + currentTile.hVal; /////
            //console.log(`Current Tile: ${currentTile.name}, Distance: ${currentTile.distance}, Heuristic: ${currentTile.hVal}`);
          }
        }
        
        // we can optimize out this slow search n destroy loop
        if (USE_FASTER_ARRAYREMOVE) {
            // we already know which one to remove so we don't need to look for it
            unvisitedList.splice(currentTileIndex,1); 
        } else {
            // do it the slow way
            arrayRemove(unvisitedList,currentTile); //// remove u from Q
        }
     
        //// "for each neighbor v of u: //// where v has not yet been removed from Q"
        var neighborsStillInUnvisitedList = currentTile.myUnvisitedNeighbors();
        for (var i = 0; i < neighborsStillInUnvisitedList.length; i++) {
          var neighborTile = neighborsStillInUnvisitedList[i];
          
          ///// A* note: hVal is NOT part of these calls, would accumulate
          if (neighborTile.isTileType(NOTHING)) {
            tentativeDistance = currentTile.distance+1;
            neighborTile.setDistIfLess(tentativeDistance, currentTile);
            neighborTile.setTile(VISITED);
          } else if (neighborTile.isTileType(DEST)) {
            tentativeDistance = currentTile.distance+1;
            neighborTile.setDistIfLess (tentativeDistance, currentTile);
            endTile=neighborTile;
            unvisitedList = []; //// empty the unvisitedList since we've found the end
          }
        }
      
      } 
      
       { //// all nodes have been accounted for, work backward from end's tiles for path
             //// terminate the algorithm from taking further steps since we found what we needed
        if (endTile!=null) {
          //console.log("Best distance found: " + endTile.distance);
			if(endTile.distance == INFINITY_START_DISTANCE){
				console.log("No Valid Path Found");
			} else {
			  // walk backward from destination to create the path
			  var previousTile = endTile.cameFrom;
			  pathfinder.tilePath = [];
			  
			  pathfinder.tilePath.unshift(endTile.idx);
			  for (var pathIndex = endTile.distance; pathIndex>1; pathIndex--) {
			//	console.log(previousTile.name);
				pathfinder.tilePath.unshift(previousTile.idx);
				previousTile.setTile(PATH);  
				previousTile = previousTile.cameFrom;  
			  }
			}
		}
  }
}

function arrayContains(arr, obj) {
    var arrLen = arr.length;
    for (var i = 0; i < arrLen; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function arrayRemove(arr, obj) {
    for (var i = arr.length-1; i >= 0; i--) {
        if (arr[i] === obj) {
            arr.splice(i,1);
            return;
        }
    }
}

