///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

// TODO: DECLARE and INTIALIZE your constants here
var START_TIME = currentTime();


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

// TODO: DECLARE your variables here
var lastKeyCode;
var boxWidth = screenWidth/10;
var ballX = screenWidth/2;
var ballY = screenHeight/2;
var ballRadius = 15;
var ballVelX = 3;
var ballVelY = 5;
var ballColor = makeColor(0.25, 0, 0.85);

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

// When setup happens...
function onSetup() {
    // TODO: INITIALIZE your variables here
    lastKeyCode = 0;
}


// When a key is pushed
function onKeyStart(key) {
    lastKeyCode = key;
}


// Called 30 times or more per second
function onTick() {
    // Some sample drawing

    clearRectangle(0, 0, screenWidth, screenHeight);

    // draw some boxes
    var j;
    for (var x=0,j=0; x < screenWidth; j++, x+=boxWidth) {
      fillRectangle(x, screenHeight/4, boxWidth, screenHeight/2, makeColor((1*j)/10, 0.5, 0.25));
    }

    // Draw a bouncing ball
    fillCircle(ballX, ballY, ballRadius, ballColor);
    //move the ballVel
    ballX = ballX + ballVelX;
    if (ballX < screenWidth/4 || ballX>(3*screenWidth)/4 ) {
      ballVelX = -ballVelX;
      ballX = ballX + ballVelX;
    }
    ballY = ballY + ballVelY;
    if (ballY < screenHeight/4 || ballY>(3*screenHeight)/4 ) {
      ballVelY = -ballVelY;
      ballY = ballY + ballVelY;
    }

    var outText = "screen dim (w,h) = " + screenWidth + " " + screenHeight;
    fillText(outText,
             screenWidth / 2,
             screenHeight - 60, /// 2,
             makeColor(0.5, 0.0, 1.0, 1.0),
             "30px Times New Roman",
             "center",
             "middle");


    fillText("last key code: " + lastKeyCode,
             screenWidth / 2,
             screenHeight / 2 + 500,
             makeColor(0.7, 0.7, 0.7, 1.0),
             "100px Arial",
             "center",
             "middle");
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
