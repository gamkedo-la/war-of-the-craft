function drawFogOfWar() {
    var fogColor = 'rgba(0, 0, 0, 0.7)';
    var revealRadius = 200;
    canvasContext.fillStyle = fogColor;
    canvasContext.fillRect(0, 0, WORLD_SIZE_PIXELS_W, WORLD_SIZE_PIXELS_H);

    // Reveal areas around each unit
    for (var i = 0; i < playerUnits.length; i++) {
        canvasContext.save();
        canvasContext.globalCompositeOperation = 'destination-out';

        // Create radial gradient for fade effect around the unit
        var gradient = canvasContext.createRadialGradient(
            playerUnits[i].x, 
            playerUnits[i].y, 
            revealRadius * 0.3, 
            playerUnits[i].x, 
            playerUnits[i].y, 
            revealRadius
        );
        
        // Make the center of the gradient fully transparent and fade towards the edge
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.0)'); // Fully clear at center
        gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.5)'); // Semi-transparent closer to the edge
        gradient.addColorStop(1, fogColor); // Fully opaque at the edge, matches fogColor

        // Apply the gradient to create the reveal effect
        canvasContext.fillStyle = gradient;
        canvasContext.beginPath();
        canvasContext.arc(playerUnits[i].x, playerUnits[i].y, revealRadius, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.restore();
    }

    for (var i = 0; i < buildingUnits.length; i++) {
        if( buildingUnits[i].type == "players hq" ||
            buildingUnits[i].type == "tower" ||
            buildingUnits[i].type == "peasant farm")
        {
            canvasContext.save();
            canvasContext.globalCompositeOperation = 'destination-out';

            // Create radial gradient for fade effect around the unit
            var gradient = canvasContext.createRadialGradient(
                buildingUnits[i].x, 
                buildingUnits[i].y, 
                revealRadius * 0.3, 
                buildingUnits[i].x, 
                buildingUnits[i].y, 
                revealRadius
            );
            
            // Make the center of the gradient fully transparent and fade towards the edge
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.0)'); // Fully clear at center
            gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.5)'); // Semi-transparent closer to the edge
            gradient.addColorStop(1, fogColor); // Fully opaque at the edge, matches fogColor

            // Apply the gradient to create the reveal effect
            canvasContext.fillStyle = gradient;
            canvasContext.beginPath();
            canvasContext.arc(buildingUnits[i].x, buildingUnits[i].y, revealRadius, 0, Math.PI * 2);
            canvasContext.fill();

            canvasContext.restore();
        }
    }
}
