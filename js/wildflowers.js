// wildflowers
// simplistic "decoration foliage" renderer
// uses perlin noise to add random details like flowers and rocks
// nothing here has any effect on gameplay and is
// designed just to make the world more attractive

var wildflowers = {

    spritesheet: wildflowersPic, // image wth a few little plants and rocks on it
    spritesheetColumns: 16, // how many sprites in this horizontal spritesheet
    flowerCount: 8500, // how many to draw on the world spread evenly
    flowerClusters: 128, // how many extra-dense clumps of flowers
    clusterSize: 128, // how many flowers in a dense clump
    flowerCanvas: null, // a world sized image overlay
    initialized: false,

    init: function() {
        // create an offscreen canvas to draw tons of flowers and rocks on
        // only draws them all ONCE at init, for performance reasons
        console.log("growing "+(this.flowerCount+(this.flowerClusters*this.clusterSize))+" wildflowers...");
        this.flowerCanvas = document.createElement("canvas");
        this.flowerCanvas.width = WORLD_SIZE_PIXELS_W;
        this.flowerCanvas.height = WORLD_SIZE_PIXELS_H;
        this.flowerCTX = this.flowerCanvas.getContext('2d');
        // evenly spread out
        for (let i=0; i<this.flowerCount; i++) {
            let spr = Math.floor(Math.random()*this.spritesheetColumns);
            let x = Math.floor(Math.random()*WORLD_SIZE_PIXELS_W);
            let y = Math.floor(Math.random()*WORLD_SIZE_PIXELS_W);
            this.flowerCTX.drawImage(this.spritesheet,spr*8,0,8,8,x,y,8,8);
        }
        // some extra-dense clusters of "flowers" of the same kind
        for (let c=0; c<this.flowerClusters; c++) {
            let spr = Math.floor(Math.random()*this.spritesheetColumns);
            let x = Math.floor(Math.random()*WORLD_SIZE_PIXELS_W);
            let y = Math.floor(Math.random()*WORLD_SIZE_PIXELS_W);
            for (let i=0; i<this.clusterSize; i++) {
                // random walk additive wobble from base x,y
                x += Math.floor((Math.random()*16)-8);
                y += Math.floor((Math.random()*16)-8);
                this.flowerCTX.drawImage(this.spritesheet,spr*8,0,8,8,x,y,8,8);
            }
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