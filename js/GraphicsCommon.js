function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function coloredOutlineRectCornerToCorner(corner1X, corner1Y, corner2X, corner2Y, lineColor) {
  canvasContext.strokeStyle = lineColor;
  canvasContext.beginPath();
  canvasContext.rect(corner1X, corner1Y, corner2X-corner1X, corner2Y-corner1Y);
  canvasContext.stroke();
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
  
function drawBitmapCenteredAtLocation(graphic, sX,sY, width,height,atX, atY) {
  canvasContext.drawImage(graphic, sX,sY, width, height, atX-(width/2), atY-(height/2), width, height);
  //img, sx, sy, swidth, sheight, x, y, width, height)
};

function drawBitmapAtLocation(graphic, sX,sY, width,height,atX, atY) {
  canvasContext.drawImage(graphic, sX,sY, width, height, atX, atY, width, height);
  //img, sx, sy, swidth, sheight, x, y, width, height)
};

function colorText(showWords, textX, textY, fillColor, fontStyle) {
  canvasContext.textAlign = "left";
  canvasContext.fillStyle = fillColor;
  canvasContext.font = fontStyle; //"14px Arial Black"
  canvasContext.fillText(showWords, textX, textY);
}

function lineDraw(startX,startY,endX,endY, lineColor){
  canvasContext.beginPath();
  canvasContext.strokeStyle = lineColor;
  canvasContext.moveTo(startX, startY);
  canvasContext.lineTo(endX, endY);
  canvasContext.stroke();
}

