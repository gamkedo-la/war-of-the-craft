function drawFogOfWar() {
    var fogColor = 'rgba(0, 0, 0, 0.9)';
    var revealRadius = 200;
    
    fowCanvasContext.fillStyle = fogColor;
    fowCanvasContext.fillRect(0, 0, WORLD_SIZE_PIXELS_W, WORLD_SIZE_PIXELS_H);
    //fowCanvasContext.fillRect(0, 0, 300, 300);
    
    function revealArea(x, y, radius) {
        fowCanvasContext.globalCompositeOperation = 'destination-out';

        var gradient = fowCanvasContext.createRadialGradient(x, y, radius * 0.3, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)'); 
        gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.5)'); 
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');   

        fowCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.0)';
    
        fowCanvasContext.fillStyle = gradient;
        fowCanvasContext.beginPath();
        fowCanvasContext.arc(x, y, radius, 0, Math.PI * 2);
        fowCanvasContext.fill();
    }
    
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

function test(){
    fowCanvasContext.fillStyle = 'red';
    fowCanvasContext.fillRect(10, 10, 100, 100);

// Set the composite operation to 'destination-out'
fowCanvasContext.globalCompositeOperation = 'destination-out';

// Draw a blue circle
fowCanvasContext.fillStyle = 'blue';
fowCanvasContext.beginPath();
    canvasContext.arc(100, 100, 50, 0, 2 * Math.PI);
    fowCanvasContext.fill();
}
