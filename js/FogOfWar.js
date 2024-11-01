function drawFogOfWar() {
    var fogColor = 'rgba(0, 0, 0, 0.9)';
    var revealRadius = 200;
    
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
    fowCanvasContext.clearRect(x-radius,y-radius,radius*2,radius*2);
    unexploredCanvasContext.clearRect(x-radius,y-radius,radius*2,radius*2);
   /* fowCanvasContext.globalCompositeOperation = 'destination-out';

    var gradient = fowCanvasContext.createRadialGradient(x, y, radius * 0.3, x, y, radius);
   
   
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)'); 
    gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.5)'); 
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');   

    fowCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.0)';

    fowCanvasContext.fillStyle = gradient;
    fowCanvasContext.beginPath();
    fowCanvasContext.arc(x, y, radius, 0, Math.PI * 2);
    fowCanvasContext.fill(); */
}
