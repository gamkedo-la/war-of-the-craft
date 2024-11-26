var introCountDown = 100;
var introNotPlayed = true;
var elapsedTime = 0; 
var timestamp = 0;
var panX = 0; 
const PAN_SPEED = 2; 

var isGameRunning = false;

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
    // Clear and set the background color
    mainMenuCanvasContext.fillStyle = "red";
    mainMenuCanvasContext.fillRect(0, 0, 800, 600);

    // Loop to render all lines
    lines.forEach((line, index) => {
        mainMenuCanvasContext.textAlign = "left";
        mainMenuCanvasContext.fillStyle = "white";
        mainMenuCanvasContext.font = "14px Arial"; 
        // Adjust vertical position by index
        const lineY = lineY0 + index * lineSpace;
        mainMenuCanvasContext.fillText(line, lineX, lineY);
    });
}

let fadeOpacity = 0; 
const FADE_SPEED = 0.01; 

function transitionToGame(elapsedTime) {
  //  console.log("Transition", elapsedTime);

    // Increment opacity for the fade effect
    fadeOpacity += FADE_SPEED// * elapsedTime;

    // Draw the game elements with increasing opacity
    if (fadeOpacity >= 1) {
        fadeOpacity = 1; 
        isGameRunning = true; 
    }

    // Render the main menu fading out and the game fading in
    renderFadeEffect();
}

function renderFadeEffect() {
    // Clear the canvas
    mainMenuCanvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the main menu fading out
    mainMenuCanvasContext.save();
    mainMenuCanvasContext.globalAlpha = 1 - fadeOpacity; // Main menu fades out
    drawMainMenu();
    mainMenuCanvasContext.restore();

    // Draw the game fading in
    canvasContext.save();
    canvasContext.globalAlpha = fadeOpacity; // Game fades in
    drawGame();
    canvasContext.restore();
}
