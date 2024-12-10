var GameIsOver_ThePlayerWon = false;
var GameIsOver_ThePlayerLost = false;

function gameOver(DidThePlayerWin=true) {
    console.log("====> GAME OVER! The player "+(DidThePlayerWin?"won!":"lost."));
    isGameRunning = false;
    GameIsOver_ThePlayerWon = DidThePlayerWin;
    GameIsOver_ThePlayerLost = !DidThePlayerWin;
    if (DidThePlayerWin) {
        let yay = new Audio("sound/win.mp3");
        yay.play();
    } else {
        let boo = new Audio("sound/lose.mp3");
        boo.play();
    }
}

function drawWinScreen() {
    canvasContext.drawImage(winPic,0,0);
    drawAssignmentsGUI(true);
}

function drawLoseScreen() {
    canvasContext.drawImage(losePic,0,0);
    drawAssignmentsGUI(true);
}
