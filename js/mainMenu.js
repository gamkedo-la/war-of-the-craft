var introCountDown = 100;
var introNotPlayed = true;
var elapsedTime = 0; 
var timestamp = 0;
var panX = 0; 
const PAN_SPEED = 2; 
var fadeOpacity = 0; 
const FADE_SPEED = 0.01; 

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

function drawMainMenu() {
    // Clear and set the background
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(mainMenuPic, 0, 0, canvas.width, canvas.height);

    // Render introduction text
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "left";
    canvasContext.font = "14px Arial";
    lines.forEach((line, index) => {
        const lineY = lineY0 + index * lineSpace;
        canvasContext.fillText(line, lineX, lineY);
    });

    // Optionally, display "Press Any Key to Start"
    canvasContext.fillStyle = "gray";
    canvasContext.font = "16px Arial";
    canvasContext.fillText("Press Any Key to Start", canvas.width / 2 - 80, canvas.height - 20);
}

function transitionToGame() {
    // Increment fadeOpacity
    fadeOpacity += FADE_SPEED;

    if (fadeOpacity >= 1) {
        fadeOpacity = 1; 
        isGameRunning = true; 
    }

    renderFadeEffect();
}

function renderFadeEffect() {
    // Clear the canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the main menu fading out
    canvasContext.save();
    canvasContext.globalAlpha = 1 - fadeOpacity; // Main menu fades out
    drawMainMenu();
    canvasContext.restore();

    // Draw the game fading in
    canvasContext.save();
    canvasContext.globalAlpha = fadeOpacity; // Game fades in
    drawGame();
    canvasContext.restore();
}

