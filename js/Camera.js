const DEBUG_CAMERA_SCROLLING = false;
const CAMERA_SCROLL_SPEED = 50;

var camera = {
    x:0,
    y:0,
    update:function() {

        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;

        // this is just a demo of the effect in action =)
        if (DEBUG_CAMERA_SCROLLING) {
            this.x = (Math.sin(performance.now()/4000)/2+0.5)*300;
            this.y = (Math.cos(performance.now()/2300)/2+0.5)*100;
        }
    }
};
