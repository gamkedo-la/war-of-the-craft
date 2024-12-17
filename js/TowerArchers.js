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
                let dir = Math.atan2(closestTarget.y - tower.y, closestTarget.x - tower.x);
                console.log("firing an arrow from "
                    +Math.round(tower.x)+","+Math.round(tower.y)
                    +" to "+Math.round(closestTarget.x)+","+Math.round(closestTarget.y)
                    +" at angle "+dir.toFixed(2));
                allKnownArrows.push({x:tower.x,y:tower.y,angle:dir,life:100});
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
    let spd = 8;
    // we have to go backwards so we can splice the array safely while looping
    for (var i = allKnownArrows.length - 1; i >= 0; i--) {
        let arrow = allKnownArrows[i];
        // move
        arrow.x += Math.cos(arrow.angle) * spd;
        arrow.y += Math.sin(arrow.angle) * spd;
        drawBitmapCenteredWithRotation(arrowPic,arrow.x,arrow.y,arrow.angle);
        // eventually fall to the ground
        arrow.life--;
        if (arrow.life<=0) allKnownArrows.splice(i, 1); // remove from allKnownArrows[]
    }

}