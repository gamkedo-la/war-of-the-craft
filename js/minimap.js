const MINIMAP_X = 500;
const MINIMAP_Y = 500;
const MINIMAP_WIDTH = 100;
const MINIMAP_HEIGHT = 100;
const mapXSize = GRID_ROWS * GRID_WIDTH;
const mapYSize = GRID_COLUMNS * GRID_HEIGHT;
const MINIMAPXRELATIVESIZE = mapXSize / MINIMAP_WIDTH;
const MINIMAPYRELATIVESIZE = mapYSize / MINIMAP_HEIGHT;

//ilk başta 800 e 600 ü 100 e 75 göre scale et. Mesela 1-1 1-2 1-3 1-4 2-1 gibi pixellerin hepsi 100 e 75 te 1e1 e denk gelir.
//bunu 100 e 75lik bir forla dön ilk başta. her pixel için daha büyük scalede denk gelen world unitleri bir arraye at.
//Bu arrayda bulunan elemanların bir çiziş sırası olmalı.
//ağaçlar en son, sonra madenler, sonra binalar, en büyük öncelik de unitler.
//bunu başarmak için, çizilebilecek bütün classlara çizilmeSırası alanı eklenip, ona göre array sortlanabilir.

function drawMinimap() {
    console.log('world grid minimap:');
    colorRect(MINIMAP_X, MINIMAP_Y, MINIMAP_WIDTH, MINIMAP_HEIGHT, 'Brown');

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
