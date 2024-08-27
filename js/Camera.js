const DEBUG_CAMERA_SCROLLING = false;
const CAMERA_SCROLL_SPEED = 50;

var camera = {
    x:0,
    y:0,
    update:function() {

        // to force it to not go into the negatives? make these 0
        if (this.x < -500) this.x = -500;
        if (this.y < -500) this.y = -500;

        // this is just a demo of the effect in action =)
        if (DEBUG_CAMERA_SCROLLING) {
            this.x = (Math.sin(performance.now()/4000)/2+0.5)*300;
            this.y = (Math.cos(performance.now()/2300)/2+0.5)*100;
        }
    }
};
