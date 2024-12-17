var allKnownTowers = []; // an array of "tower" units
var allKnownArrows = []; // just {x,y,target} 

// archers... fire!!
function updateTowerArchers() {
    let now = performance.now(); // in ms
    // loop through all towers and maybe shoot
    for (tower of allKnownTowers) {
        if (!tower.timeToShoot || tower.timeToShoot < now) {
            console.log("tower is ready to shoot another arrow because now is "+now.toFixed(0));
            let closestTarget = findClosestUnitInRange(tower.x,tower.y,800,enemyUnits);
            if (closestTarget) {
                console.log("...and found a nearby enemy to target!");
                // TODO:
                // spawn an arrow!
            } else {
                console.log("...but there were no nearby enemies.");
            }
            tower.timeToShoot = now + 2000 + Math.random() * 1000; // wait 2-3 seconds
        }
    }
    // TODO:
    // loop through all arrows and move them,
    // checking collision with units
    // if they hit something, reduce it's hp
}

function drawAllArrows() {
    for (arrow of allKnownArrows) {
        // TODO
    }
}