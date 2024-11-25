var backgroundSoundLoop, musicLowEnergy, musicHighEnergy;

function startBackgroundAudio() {
    
    backgroundSoundLoop = new Audio("audio/forest-ambience.mp3");
    backgroundSoundLoop.volume = 0.25;
    backgroundSoundLoop.loop = true;
    backgroundSoundLoop.play();

    musicLowEnergy = new Audio("audio/music-low-energy.wav");
    musicLowEnergy.volume = 0.5;
    musicLowEnergy.loop = true;
    musicLowEnergy.play();

    musicHighEnergy = new Audio("audio/music-high-energy.wav");
    musicHighEnergy.volume = 0;
    musicHighEnergy.loop = true;
    musicHighEnergy.play(); // play silenty so both tracks are synched

}

var audioFormat;
var isMuted = false;
var soundSetforMeetings = false; //make false to hear at normal level

//Background Sounds
// - example var musicSound = new BackgroundMusicClass("kyleTrack_1");

//Asset Sounds
// - example:  var doorOpenning = new SoundOverlapsClass("door_openning"); = 
var orcWarningSound = new SoundOverlapsClass("orcWarning")
var warriorRecruitmentHoovering = new SoundOverlapsClass("WarriorRecruitmentHoovering");
var warriorHurtSound = new SoundOverlapsClass("WarriorHurt");
var warriorSelectedSound = new SoundOverlapsClass("WarriorSelected");
var warriorDeadSound = new SoundOverlapsClass("WarriorHurt"); //create a dead sound
var warriorFightingSound = new SoundOverlapsClass("WarriorFighting");
var peasantRecruitmentHooveringSound = new SoundOverlapsClass("PeasantRecruitmentHoovering");
var peasantHurtSound = new SoundOverlapsClass("PeasantOuch");
var peasantSelectedSound = new SoundOverlapsClass("PeasantSelected");
var peasantDeadSound = new SoundOverlapsClass("PeasantOuch"); //create a dead sound
var peasantFarmCompletedSound = new SoundOverlapsClass("PeasantFarmComplete");
var peasantTowerCompletedSound = new SoundOverlapsClass("PeasantTowerComplete");
var peasantChoppingTree = new SoundOverlapsClass('PeasantWoodChop')
var goldMineSelectedSound = new SoundOverlapsClass("GoldMineSelected");
var hQUnderAttackSound = new SoundOverlapsClass("GoldMineSelected");
var introSound = new SoundOverlapsClass("Intro");



function setFormat() {
    var audio = new Audio();
    if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
    } else {
		audioFormat = ".ogg";
    }
}

function SoundOverlapsClass(filenameWithPath) {
    setFormat();
    var altSoundTurn = false;
    var mainSound = new Audio("sound/" + filenameWithPath + audioFormat);
    var altSound = new Audio("sound/" + filenameWithPath + audioFormat);
    
    this.play = function() {
        if (waitingForFirstClick) return; // avoid security issues (browser crashes if no clicks yet)
    	if (isMuted) {
    		return;
    	}
		if (altSoundTurn) {
			altSound.currentTime = 0;
			if(soundSetforMeetings){
				altSound.volume = 0.05;  //quieter for screen sharing during meetings
			}
			altSound.play(); // WARNING: this line can cause the browser to crash if you have not yet clicked the screen
		} else {
			mainSound.currentTime = 0;
			if(soundSetforMeetings){
				mainSound.volume = 0.05; //quieter for screen sharing during meetings
			}
			mainSound.play(); // WARNING: this line can cause the browser to crash if you have not yet clicked the screen
		}
		altSoundTurn = !altSoundTurn;
    }
}  

function BackgroundMusicClass(filenameWithPath) {
    this.loopSong = function() {
		setFormat();

		if (musicSound != null) {
		//	musicSound.pause();
			musicSound = null;
		}
		musicSound = new Audio("sound/" + filenameWithPath + audioFormat);
		if(soundSetforMeetings){
			musicSound.volume = 0.04; //quieter for screen sharing during meetings
		}
		musicSound.loop = true;
		musicSound.play();
    }

    this.startOrStopMusic = function() {
        if (!musicSound) {
            console.error("ERROR: musicSound not initialized before startOrStopMusic was run!");
            return; 
        }
		if (isMuted == false) {
			musicSound.play();
		} else {
			musicSound.pause();
		}
    }
}



