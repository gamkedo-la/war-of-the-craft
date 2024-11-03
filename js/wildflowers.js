// wildflowers
// simplistic "decoration foliage" renderer
// uses perlin noise to add random details like flowers and rocks
// nothing here has any effect on gameplay and is
// designed just to make the world more attractive

var wildflowers = {

    spritesheet: wildflowersPic, // image wth a few little plants and rocks on it
    spritesheetColumns: 8, // how many sprites in this horizontal spritesheet
    flowerCount: 7500, // how many to draw on the world
    flowerCanvas: null, // a world sized image overlay
    initialized: false,

    init: function() {
        // create an offscreen canvas to draw tons of flowers and rocks on
        // only draws them all ONCE at init, for performance reasons
        console.log("growing "+this.flowerCount+" wildflowers...");
        this.flowerCanvas = document.createElement("canvas");
        this.flowerCanvas.width = WORLD_SIZE_PIXELS_W;
        this.flowerCanvas.height = WORLD_SIZE_PIXELS_H;
        this.flowerCTX = this.flowerCanvas.getContext('2d');
        for (let i=0; i<this.flowerCount; i++) {
            let spr = Math.floor(Math.random()*this.spritesheetColumns);
            let x = Math.floor(Math.random()*WORLD_SIZE_PIXELS_W);
            let y = Math.floor(Math.random()*WORLD_SIZE_PIXELS_W);
            this.flowerCTX.drawImage(this.spritesheet,spr*8,0,8,8,x,y,8,8);
        }
        this.initialized = true;
    },

    draw: function() {

        if (!this.initialized) this.init(); // once
        
        // draw all the details in a single pass using 
        // the offscreen buffer that we created on init
        canvasContext.drawImage(this.flowerCanvas,0,0);

    }

}