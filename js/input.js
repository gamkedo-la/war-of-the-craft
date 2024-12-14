var lassoX1 = 0;
var lassoY1 = 0;
var lassoX2 = 0;
var lassoY2 = 0;
var isMouseDragging = false;
var isMouseRightDragging = false;
var mouseX = 0;
var mouseY = 0;
var mouseClicked = false;
var KEY_1 = 49;
var KEY_H = 72;
var selectedUnits = [];
const MIN_DIST_TO_COUNT_DRAG = 10;
const MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE = 12;

// concole log tile clicking array used to fill "hardcoded_unwalkabale_tiles[]"
const debugListTilesClicked = true;
var allTilesClicked = "";

// returns WORLD coordinates (offset by camera viewport) not screen coordinates
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect(), root = document.documentElement;

  // account for the margins, canvas position on page, scroll amount, etc.
  mouseX = Math.floor(evt.clientX - rect.left - root.scrollLeft);
  mouseY = Math.floor(evt.clientY - rect.top - root.scrollTop);
  return {
    x: mouseX + camera.x,
    y: mouseY + camera.y
  };
}

function mouseMovedEnoughToTreatAsDrag() {
  var deltaX = lassoX1-lassoX2;
  var deltaY = lassoY1-lassoY2;
  var dragDist = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
  return ( dragDist > MIN_DIST_TO_COUNT_DRAG );
}

function getUnitUnderMouse(currentMousePos) {
  return findClosestUnitInRange(currentMousePos.x, currentMousePos.y, MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE, allUnits, null);
}

function mousemoveHandler(evt) {
  var mousePos = calculateMousePos(evt);
  if(isMouseDragging) {
    lassoX2 = mousePos.x;
    lassoY2 = mousePos.y;
  }
  if (isMouseRightDragging) {
    //console.log("CAMERA PANNING: "+evt.movementX+","+evt.movementY);
    camera.x -= evt.movementX;
    camera.y -= evt.movementY;
  }
 // console.log("Mouse: " + mousePos.x, mousePos.y)
}

var waitingForFirstClick = true; // until sounds are allowed

function mousedownHandler(evt) {
  
  if (waitingForFirstClick) {
    console.log("first click! starting background ambience and music.");
    startBackgroundAudio();
    waitingForFirstClick = false;
    skipIntroNow = true; // skip past the 15sec delay on the intro text
  }


  var mousePos = calculateMousePos(evt);
  lassoX1 = mousePos.x;
  lassoY1 = mousePos.y;
  lassoX2 = lassoX1;
  lassoY2 = lassoY1;
  if (evt.button===2) {
    //console.log("mouse-right-down: camera scroll mode ON");
    isMouseRightDragging = true;
    canvas.style.cursor = "grab";
    evt.preventDefault(); 
  } else {
    isMouseDragging = true;
    mouseClicked = true;
  }

  checkForBuildingSelected();
}

function mouseupHandler(evt) {
  isMouseDragging = false;
  mouseClicked = false;

  if (evt.button===2) {
    //console.log("mouse-right-up: camera scroll mode OFF. camera pos = "+camera.x+","+camera.y);
    isMouseRightDragging = false;
    canvas.style.cursor = "default";
    evt.preventDefault(); 
    return;
  }

  if(mouseMovedEnoughToTreatAsDrag()) {
    selectedUnits = []; // clear the selection array
    checkForPlayersSelected();
    
    document.getElementById("debugText").innerHTML = "Selected " +
                                  selectedUnits.length + " units";
  } else { // mouse didn’t move far, treat as click for move or attack command
    var mousePos = calculateMousePos(evt);
    var clickedUnit = getUnitUnderMouse(mousePos);

    if(clickedUnit != null && clickedUnit.playerControlled == false && !uIButtonClicked) { 
      // then command units to attack it!
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].setTarget(clickedUnit); 
      } 
      document.getElementById("debugText").innerHTML =
                "Player commands "+selectedUnits.length+" units to attack!";
    } else {
      // didn't click an enemy unit, so direct any currently selected units to this location
      var unitsAlongSide = Math.floor(Math.sqrt(selectedUnits.length+2));
      if(!uIButtonClicked){
        for(var i=0;i<selectedUnits.length;i++) {
          selectedUnits[i].gotoNear(mousePos.x, mousePos.y, i, unitsAlongSide);
        }
      }
      document.getElementById("debugText").innerHTML =
                "Moving to ("+mousePos.x+","+mousePos.y+")";

      // used just for debug and level design checks
      if (debugListTilesClicked) {
        allTilesClicked += pixelCoordToIndex(mousePos.x,mousePos.y)+",";
       // console.log("const presetUnwalkableTiles = ["+allTilesClicked+"];");
      }
    }
  }
}

function keydownHandler(evt) {
  /** using KeyboardEvent.key here instead of KeyboardEvent.keyCode, as the
   * latter is deprecated - more information here:
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  */

  // if we happen to be at the title screen text intro, skip the 15sec delay
  skipIntroNow = true;

  console.log(`[debugging | keydown event] key pressed: ${evt.key}`);
  
  // debug cheat keys to trigger win/lose immediately
  if (evt.key === '0') { gameOver(true); } 
  if (evt.key === '9') { gameOver(false); } 
  
  // debug cheat key to spawn tons of baddies and soldiers to test battle
  if (evt.key === '8') { debugWAR(); } 


  if (evt.key === 'Escape') {
    if (isGamePaused) {
      console.log('Unpausing Game');
      document.getElementById("debugText").innerHTML = "";

      runGameLoop();
    } else {
      console.log('Pausing Game');
      document.getElementById("debugText").innerHTML = "Game is paused";

      // this cancels the existing timer interval, effectively pausing the game
      clearInterval(currentIntervalId);
      currentIntervalId = null;
    }
    isGamePaused = !isGamePaused;
  } // esc

  // camera scrolling via arrow keys
  // FIXME: smooth scroll while down
  if (evt.key === 'ArrowLeft') { camera.x -= CAMERA_SCROLL_SPEED; }
  if (evt.key === 'ArrowRight') { camera.x += CAMERA_SCROLL_SPEED; }
  if (evt.key === 'ArrowUp') { camera.y -= CAMERA_SCROLL_SPEED; }
  if (evt.key === 'ArrowDown') { camera.y += CAMERA_SCROLL_SPEED; }
  if (evt.key.toLowerCase() === "h") {showHelp = !showHelp;}
  if (evt.key === '1') { 
    startPath(100, playerUnits[0]);
  }
  evt.preventDefault();
}