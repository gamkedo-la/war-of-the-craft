const DEBUG_CAMERA_SCROLLING = false;
const CAMERA_SCROLL_SPEED = 50;

var camera = {
    x:0,
    y:0,
    update:function() {

        // to force it to not go into the negatives? make these 0
        if (this.x < -100) this.x = -100;
        if (this.y < -100) this.y = -100;
        // don't go past the edge of the world bottom right either!
        if (this.x > 2500) this.x = 2500;
        if (this.y > 2700) this.y = 2700;


        // this is just a demo of the effect in action =)
        if (DEBUG_CAMERA_SCROLLING) {
            this.x = (Math.sin(performance.now()/4000)/2+0.5)*300;
            this.y = (Math.cos(performance.now()/2300)/2+0.5)*100;
        }
    }
};
