var backGroundPic = document.createElement("img");
var goblinPic = document.createElement("img");
var peasantPic = document.createElement("img");
var healthBarPic = document.createElement("img");
var humanHQPic = document.createElement("img");
var goblinHQPic = document.createElement("img");
var orcPic = document.createElement("img");
var treePic = document.createElement("img");
var minePic = document.createElement("img");
var framePic = document.createElement("img");
var lumberPic = document.createElement("img");

var picsToLoad = 0;

//All pictures prior to launching the game.  If a picture doesn't load, the game doesn't launch.
function countLoadedImagesAndLaunchIfReady(){
		picsToLoad--;
		console.log(picsToLoad);
		if(picsToLoad == 0) {
			imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName, sX, sY) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/" + fileName;
	imgVar.sx = sX;
	imgVar.sy = sY;
}

//All images are loaded here.  varNames are for any pictures that are not tiles.
function loadImages() {
	
		var imageList = [
			{varName: backGroundPic, theFile: "background.png", sX: 0, sY: 0},
			{varName: goblinPic, theFile: "goblin.png", sX: 0, sY: 0},
			{varName: orcPic, theFile: "orc.png", sX: 0, sY: 0},
			{varName: peasantPic, theFile: "peasant.png", sX: 0, sY: 0},
			{varName: healthBarPic, theFile: "healthbar.png", sX: 0, sY: 0},
			{varName: humanHQPic, theFile: "humanHQ.png", sX: 0, sY: 0},
			{varName: goblinHQPic, theFile: "goblinHQ.png", sX: 0, sY: 0},
			{varName: treePic, theFile: "tree.png", sX: 0, sY: 0},
			{varName: minePic, theFile: "mine.png", sX: 0, sY: 0},
			{varName: framePic, theFile: "buttonPics.png", sX: 0, sY: 0},
			{varName: lumberPic, theFile: "buttonPics.png", sX: 0, sY:30}
		];
			
	picsToLoad = imageList.length;

	for(var i=0; i<imageList.length; i++) {
		beginLoadingImage(imageList[i].varName, imageList[i].theFile, imageList[i].sx, imageList[i].sy);
	}
}
