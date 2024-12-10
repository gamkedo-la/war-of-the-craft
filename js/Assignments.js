// Assignments are like "quests" or "achievements"

// the current player's all time totals
var assignmentTotals = {
    woodChopped:0,
    goldMined:0,
    farmsBuilt:0,
    foodHarvested:0,
    battlesWon:0,
    battlesLost:0,
    // TODO: save/load using localstorage
}

// these are the quest totals we are aiming for
var assignmentTargets = {
    woodChopped:120,
    goldMined:60,
    farmsBuilt:8,
    foodHarvested:80,
    battlesWon:10,
    battlesLost:99999999,
}

// an area on the right side of the screen
// for quests and battle assignments
function drawAssignmentsGUI(forTheGameOverScreen=false) {
    let tx = 660;
    let ty = 494;
    let th = 18;
    let rgb = "rgba(64,32,1)";
    let fnt = "14px Arial";
    let lines = 0;

    // adjust this for use on the gameover screens?
    if (forTheGameOverScreen) {
        tx = 260;
        ty = 330;
        fnt = "24px Arial";
    } 

    if (!forTheGameOverScreen) {
        canvasContext.drawImage(assignmentsGUIPic, tx-30, ty-47);
        //colorText("ASSIGNMENTS:",tx+1,ty+(lines*th)+1,"black",fnt); // drop shadow?
        colorText("ASSIGNMENTS:",tx,ty+(lines++*th),"black",fnt);
    }
    
    let gotAllWood = assignmentTotals.woodChopped >= assignmentTargets.woodChopped;
    let gotAllGold = assignmentTotals.goldMined >= assignmentTargets.goldMined;
    let gotAllFarms = assignmentTotals.farmsBuilt >= assignmentTargets.farmsBuilt;
    let gotAllFood = assignmentTotals.foodHarvested >= assignmentTargets.foodHarvested;
    let gotAllWins = assignmentTotals.battlesWon >= assignmentTargets.battlesWon;

    colorText((gotAllWood ? "☑ " : "☐ ") + "Chop "+assignmentTotals.woodChopped + "/" + assignmentTargets.woodChopped +" wood", tx,ty+(lines++*th),rgb,fnt);
    colorText((gotAllGold ? "☑ " : "☐ ") + "Mine "+assignmentTotals.goldMined + "/" + assignmentTargets.goldMined +" gold", tx,ty+(lines++*th),rgb,fnt);
    colorText((gotAllFarms ? "☑ " : "☐ ") + "Build "+assignmentTotals.farmsBuilt + "/" + assignmentTargets.farmsBuilt +" farms", tx,ty+(lines++*th),rgb,fnt);
    colorText((gotAllFood ? "☑ " : "☐ ") + "Harvest "+assignmentTotals.foodHarvested + "/" + assignmentTargets.foodHarvested +" food", tx,ty+(lines++*th),rgb,fnt);
    colorText((gotAllWins ? "☑ " : "☐ ") + "Win "+assignmentTotals.battlesWon + "/" + assignmentTargets.battlesWon +" battles", tx,ty+(lines++*th),rgb,fnt);

    if (!forTheGameOverScreen) {
        if (gotAllWood && gotAllGold && gotAllFarms && gotAllFood && gotAllWins) {
            console.log("PLAYER WINS THE GAME! All assignments complete.");
            gameOver(true);
        }
    }    
}