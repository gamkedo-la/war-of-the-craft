const DEBUG_CAMERA_SCROLLING = false;
const CAMERA_SCROLL_SPEED = 50;

var camera = {
    x:0,
    y:0,
    update:function() {
        // TODO: only change via mouse right drag / arrow keys
        // this is just a demo of the effect in action =)
        if (DEBUG_CAMERA_SCROLLING) {
            this.x = (Math.sin(performance.now()/4000)/2+0.5)*300;
            this.y = (Math.cos(performance.now()/2300)/2+0.5)*100;
        }
    }
};
