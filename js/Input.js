var lassoX1 = 0;
var lassoY1 = 0;
var lassoX2 = 0;
var lassoY2 = 0;
var isMouseDragging = false;
var isMouseRightDragging = false;
var mouseX = 0;
var mouseY = 0;
var mouseClicked = false;

var selectedUnits = [];
const MIN_DIST_TO_COUNT_DRAG = 10;
const MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE = 12;

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
  return findClosestUnitInRange(currentMousePos.x, currentMousePos.y, MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE, allUnits);
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
}

function mousedownHandler(evt) {
  var mousePos = calculateMousePos(evt);
  lassoX1 = mousePos.x;
  lassoY1 = mousePos.y;
  lassoX2 = lassoX1;
  lassoY2 = lassoY1;
  if (evt.button===2) {
    console.log("mouse-right-down: camera scroll mode ON");
    isMouseRightDragging = true;
    canvas.style.cursor = "grab";
    evt.preventDefault(); 
  } else {
    isMouseDragging = true;
    mouseClicked = true;
  }
}

function mouseupHandler(evt) {
  isMouseDragging = false;
  mouseClicked = false;

  if (evt.button===2) {
    console.log("mouse-right-up: camera scroll mode OFF. camera pos = "+camera.x+","+camera.y);
    isMouseRightDragging = false;
    canvas.style.cursor = "default";
    evt.preventDefault(); 
    return;
  }

  if(mouseMovedEnoughToTreatAsDrag()) {
    selectedUnits = []; // clear the selection array

    for(var i=0;i<playerUnits.length;i++) {
      if( playerUnits[i].isInBox(lassoX1,lassoY1,lassoX2,lassoY2) ) {
        selectedUnits.push(playerUnits[i]);
        if(selectedUnits[0].jobType == "peasant"){
          peasantSelected = true;
          warriorSelected = false;
        } else if (selectedUnits[0].jobType == "warrior"){
          peasantSelected = false;
          warriorSelected = true;
        }
      }
    }
    document.getElementById("debugText").innerHTML = "Selected " +
                                  selectedUnits.length + " units";
  } else { // mouse didn’t move far, treat as click for move or attack command
    var mousePos = calculateMousePos(evt);
    var clickedUnit = getUnitUnderMouse(mousePos);

    if(clickedUnit != null && clickedUnit.playerControlled == false) { 
      // then command units to attack it!
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].setTarget(clickedUnit); 
      } 
      document.getElementById("debugText").innerHTML =
                "Player commands "+selectedUnits.length+" units to attack!";
    } else {
      // didn't click an enemy unit, so direct any currently selected units to this location
      var unitsAlongSide = Math.floor(Math.sqrt(selectedUnits.length+2));
      for(var i=0;i<selectedUnits.length;i++) {
        selectedUnits[i].gotoNear(mousePos.x, mousePos.y, i, unitsAlongSide);
      }
      document.getElementById("debugText").innerHTML =
                "Moving to ("+mousePos.x+","+mousePos.y+")";
    }
  }
}

function keydownHandler(evt) {
  /** using KeyboardEvent.key here instead of KeyboardEvent.keyCode, as the
   * latter is deprecated - more information here:
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  */
  console.log(`[debugging | keydown event] key pressed: ${evt.key}`);
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

}