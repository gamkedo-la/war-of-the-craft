var introCountDown = 500;
var introNotPlayed = true;
var elapsedTime = 0; 
var timestamp = 0;
var panX = 0; 
const PAN_SPEED = 2; 

var isGameRunning = true;


// Lines of text for the introduction
const lines = [
    "Welcome to Dagger’s Gate, Governor! Once a thriving outpost,",
    "this island holds the promise of prosperity but hides its fair share of dangers.",
    "Reports from passing traders whisper of goblins and orcs lurking in the wilderness, waiting to strike.",
    "The task ahead is daunting: grow your settlement into a thriving town, rally your people,",
    "and prepare for whatever challenges lie ahead.",
    "",
    "As governor, every decision you make will shape the future of Dagger’s Gate.",
    "Will you lead your people to safety and prosperity, or will the island’s dangers overwhelm you?",
    "The fate of this land rests in your hands.",
    "",
    "Build, survive, and conquer—your journey begins now."
];

// Starting positions and spacing
const lineX = 10;  // Horizontal position for all lines
const lineY0 = 100; // Starting vertical position
const lineSpace = 20; // Spacing between lines

function drawMainMenu(){
    // Loop to render all lines
    camera.x = 0;
    lines.forEach((line, index) => {
        const yPosition = lineY0 + lineSpace * index;
        colorText(line, lineX, yPosition, "white", "14px Arial Black");
    });
}

function transitionToGame(deltaTime) {
    // Increment pan position
    camera.x += PAN_SPEED * (deltaTime / 1000); // Smooth pan based on elapsed time
    if (camera.x > playerUnits[0].x) {
        isGameRunning = true; // Transition is complete
    }
}
