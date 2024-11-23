var introCountDown = 500;
var introNotPlayed = true;


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
    lines.forEach((line, index) => {
        const yPosition = lineY0 + lineSpace * index;
        colorText(line, lineX, yPosition, "white", "14px Arial Black");
    });
}
