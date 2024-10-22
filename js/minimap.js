const MINIMAP_X = 668;
const MINIMAP_Y = 32;
const MINIMAP_WIDTH = 100;
const MINIMAP_HEIGHT = 100;
const mapXSize = GRID_ROWS * GRID_WIDTH;
const mapYSize = GRID_COLUMNS * GRID_HEIGHT;
const MINIMAPXRELATIVESIZE = mapXSize / MINIMAP_WIDTH;
const MINIMAPYRELATIVESIZE = mapYSize / MINIMAP_HEIGHT;

function drawMinimap() {
    
    // background is no longer needed due to gui image:
    // colorRect(MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT, 'rgba(0,0,0,0.2)');
    canvasContext.drawImage(minimapGUIPic, MINIMAP_X-30, MINIMAP_Y-30);

    drawArrayOfUnits(trees);
    drawArrayOfUnits(mines);
    drawArrayOfUnits(buildingUnits);
    drawArrayOfUnits(playerUnits);
    drawArrayOfUnits(enemyUnits);

    function drawArrayOfUnits(arrayOfUnits) {
        for (var i = 0; i < arrayOfUnits.length; i++) {
            var unitMinimapX = Math.floor(arrayOfUnits[i].x / MINIMAPXRELATIVESIZE);
            var unitMinimapY = Math.floor(arrayOfUnits[i].y / MINIMAPYRELATIVESIZE);
            var unitMinimapXPosition = unitMinimapX + MINIMAP_X;
            var unitMinimapYPosition = unitMinimapY + MINIMAP_Y;

            arrayOfUnits[i].drawOnMinimap(unitMinimapXPosition, unitMinimapYPosition);
        }
    }
} 
