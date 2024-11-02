function drawFogOfWar() {
    var fogColor = 'rgba(0, 0, 0, 0.9)';
    var revealRadius = 200;

    for(var i=0;i<allUnits.length;i++) {
        if(allUnits[i].type != "trees" &&
           allUnits[i].type != "mines" 
        ){
            allUnits[i].render = false;
        }
    }
    
 //   fowCanvasContext.fillStyle = fogColor;
 //   fowCanvasContext.fillRect(0, 0, WORLD_SIZE_PIXELS_W, WORLD_SIZE_PIXELS_H);
    fowCanvasContext.fillStyle = "black";
    fowCanvasContext.fillRect(0, 0, fowCanvas.width, fowCanvas.height);

    //fowCanvasContext.fillRect(0, 0, 300, 300);
    
    // Reveal areas around each player unit
    for (var i = 0; i < playerUnits.length; i++) {
        revealArea(playerUnits[i].x, playerUnits[i].y, revealRadius);
    }
    
    // Reveal areas around specific building types
    for (var i = 0; i < buildingUnits.length; i++) {
        if (["players hq", "tower", "peasant farm"].includes(buildingUnits[i].type)) {
            revealArea(buildingUnits[i].x, buildingUnits[i].y, revealRadius);
        }
    }    
}

function revealArea(x, y, radius) {
    var gradient = unexploredCanvasContext.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');  
    gradient.addColorStop(.6, 'rgba(255, 255, 255, .9)');  
    gradient.addColorStop(.8, 'rgba(255, 255, 255, .8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');  

    fowCanvasContext.globalCompositeOperation = 'destination-out';
    fowCanvasContext.beginPath();
    fowCanvasContext.arc(x, y, radius, 0, Math.PI * 2);
    fowCanvasContext.fillStyle = gradient;
    fowCanvasContext.fill();

    unexploredCanvasContext.globalCompositeOperation = 'destination-out';
    unexploredCanvasContext.beginPath();
    unexploredCanvasContext.arc(x, y, radius, 0, Math.PI * 2);
    unexploredCanvasContext.fillStyle = gradient;
    unexploredCanvasContext.fill();

    fowCanvasContext.globalCompositeOperation = 'source-over';
    unexploredCanvasContext.globalCompositeOperation = 'source-over';


    var nearUnits = returnUnitsInNearbyPixels(x, y, radius);
    for (var i = 0; i < nearUnits.length; i++) {
        nearUnits[i].render = true;
    }
}
