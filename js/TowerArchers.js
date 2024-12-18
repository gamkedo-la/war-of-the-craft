const TOWER_SIGHT_RANGE = 400; //pixels
const TOWER_SHOT_DELAY_MIN = 500; // ms
const TOWER_SHOT_DELAY_MAX = 2000; // ms
const TOWER_ARROW_SPEED = 8; // pixels per frame
const TOWER_ARROW_LIFESPAN = 100; // frames until it vanishes
const TOWER_DEBUG = false; // output console log messages
const TOWER_ARROW_HIT_RADIUS = 20; // max dist to a unit to count as a hit
const TOWER_ARROW_DAMAGE = 20; // insta-kill! maybe reduce for multiple hits?
const TOWER_SHOT_OFFSET_X = 0; 
const TOWER_SHOT_OFFSET_Y = -30; // so arrows appear from roof

var allKnownTowers = []; // an array of "tower" units
var allKnownArrows = []; // just {x,y,target} 

// archers... fire!!
function updateTowerArchers() {
    let now = performance.now(); // in ms
    // loop through all towers and maybe shoot
    for (tower of allKnownTowers) {
        let firex = tower.x+TOWER_SHOT_OFFSET_X;
        let firey = tower.y+TOWER_SHOT_OFFSET_Y;
        if (!tower.timeToShoot || tower.timeToShoot < now) {
            if (TOWER_DEBUG) console.log("tower is ready to shoot another arrow because now is "+now.toFixed(0));
            let closestTarget = findClosestUnitInRange(tower.x,tower.y,TOWER_SIGHT_RANGE,enemyUnits);
            if (closestTarget) {
                if (TOWER_DEBUG) console.log("...and found a nearby enemy to target!");

                let dir = Math.atan2(closestTarget.y - firey, closestTarget.x - firex);
                if (TOWER_DEBUG) console.log("firing an arrow from "
                    +Math.round(firex)+","+Math.round(firey)
                    +" to "+Math.round(closestTarget.x)+","+Math.round(closestTarget.y)
                    +" at angle "+dir.toFixed(2));

                // spawn an arrow
                allKnownArrows.push({x:firex,y:firey,angle:dir,life:TOWER_ARROW_LIFESPAN});
                arrowSound.play();

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

        // detect a hit
        let closestTarget = findClosestUnitInRange(arrow.x,arrow.y,TOWER_ARROW_HIT_RADIUS,enemyUnits);
        if (closestTarget) {
            if (TOWER_DEBUG) console.log("ARROW HIT A UNIT!");
            if (closestTarget.health) {
                warriorHurtSound.play(); // FIXME: or orc or peasant
                closestTarget.health -= TOWER_ARROW_DAMAGE;
                if (closestTarget.health <= 0) {
                    closestTarget.isDead = true;
                    if (TOWER_DEBUG) console.log("ARROW KILLED A UNIT!");
                    // arrow should also dissappear now that it hit something
                   arrow.life = 0; 
                }
            }
        }

        // eventually fall to the ground and vanish
        arrow.life--;
        if (arrow.life<=0) allKnownArrows.splice(i, 1); // remove from allKnownArrows[]
    }

}