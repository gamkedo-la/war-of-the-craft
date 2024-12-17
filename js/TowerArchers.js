const TOWER_SIGHT_RANGE = 600; //pixels
const TOWER_SHOT_DELAY_MIN = 500; // ms
const TOWER_SHOT_DELAY_MAX = 2000; // ms
const TOWER_ARROW_SPEED = 8; // pixels per frame
const TOWER_ARROW_LIFESPAN = 100; // frames until it vanishes
const TOWER_DEBUG = false; // output console log messages

var allKnownTowers = []; // an array of "tower" units
var allKnownArrows = []; // just {x,y,target} 

// archers... fire!!
function updateTowerArchers() {
    let now = performance.now(); // in ms
    // loop through all towers and maybe shoot
    for (tower of allKnownTowers) {
        if (!tower.timeToShoot || tower.timeToShoot < now) {
            if (TOWER_DEBUG) console.log("tower is ready to shoot another arrow because now is "+now.toFixed(0));
            let closestTarget = findClosestUnitInRange(tower.x,tower.y,TOWER_SIGHT_RANGE,enemyUnits);
            if (closestTarget) {
                if (TOWER_DEBUG) console.log("...and found a nearby enemy to target!");
                // TODO:
                // spawn an arrow!
                let dir = Math.atan2(closestTarget.y - tower.y, closestTarget.x - tower.x);
                if (TOWER_DEBUG) console.log("firing an arrow from "
                    +Math.round(tower.x)+","+Math.round(tower.y)
                    +" to "+Math.round(closestTarget.x)+","+Math.round(closestTarget.y)
                    +" at angle "+dir.toFixed(2));
                allKnownArrows.push({x:tower.x,y:tower.y,angle:dir,life:TOWER_ARROW_LIFESPAN});
            } else {
                if (TOWER_DEBUG) console.log("...but there were no nearby enemies.");
            }
            // wait a while before firing again
            tower.timeToShoot = now + TOWER_SHOT_DELAY_MIN + Math.random() * (TOWER_SHOT_DELAY_MAX-TOWER_SHOT_DELAY_MIN); 
        }
    }
    // TODO:
    // loop through all arrows and move them,
    // checking collision with units
    // if they hit something, reduce it's hp
}

function drawAllArrows() {
    // we have to go backwards so we can splice the array safely while looping
    for (var i = allKnownArrows.length - 1; i >= 0; i--) {
        let arrow = allKnownArrows[i];
        // move
        arrow.x += Math.cos(arrow.angle) * TOWER_ARROW_SPEED;
        arrow.y += Math.sin(arrow.angle) * TOWER_ARROW_SPEED;
        drawBitmapCenteredWithRotation(arrowPic,arrow.x,arrow.y,arrow.angle);
        // eventually fall to the ground
        arrow.life--;
        if (arrow.life<=0) allKnownArrows.splice(i, 1); // remove from allKnownArrows[]
    }

}