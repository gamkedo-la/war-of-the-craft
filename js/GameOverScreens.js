var GameIsOver_ThePlayerWon = false;
var GameIsOver_ThePlayerLost = false;

function gameOver(DidThePlayerWin=true) {
    console.log("====> GAME OVER! The player "+(DidThePlayerWin?"won!":"lost."));
    GameIsOver_ThePlayerWon = DidThePlayerWin;
    GameIsOver_ThePlayerLost = !DidThePlayerWin;
    isGameRunning = false;
}

function drawWinScreen() {
    canvasContext.drawImage(winPic,0,0);
}

function drawLoseScreen() {
    canvasContext.drawImage(losePic,0,0);
}
