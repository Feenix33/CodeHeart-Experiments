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
var radA, radB, radC; // radii
var timeSlow; // to slow down the animation
var ptSize; // size of the point
var ptColor; // color of the point
var angle; // drawing angle
var deltaT; // amount to increment
var hue;  // color from the paint example
var steps; // step size

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

// When setup happens...
function onSetup() {
  timeSlow = 20; // to slow down the animation
  ptSize = 10; // size of the point
  ptColor = makeColor(0.99, 0.00, 0.00); // color of the point
  steps = 100
  deltaT = 2 * Math.PI / steps; // amount to increment
  hue = 0;

  relaunch = true; // drawing parameters set in init routine

  //clearRectangle(0, 0, screenWidth, screenHeight);
}


// When a key is pushed
function onKeyStart(key) {
  console.log ("keycode = " + key)
  if (key != lastKeyCode) {
    lastKeyCode = key;
    switch (key) {
      case 82:
        relaunch = true;
        break;
      case 107:
      case 187:
        steps -= 10;
        if (steps < 10) { steps = 10;}
        deltaT = 2 * Math.PI / steps; // amount to increment
        lastKeyCode = 0;
        break;
      case 109:
      case 189:
        steps += 10;
        if (steps > 150) { steps = 150;}
        deltaT = 2 * Math.PI / steps; // amount to increment
        lastKeyCode = 0;
        break;
    }
  }
}


// Called 30 times or more per second
function onTick() {
  if (relaunch) {
    clearRectangle(0, 0, screenWidth, screenHeight);
    InitializeDrawing();
    relaunch = false;
  }
  hue = (hue + 1) % 360;

  r = (cos((hue +   0) * Math.PI / 180) + 3) / 4;
  g = (cos((hue + 120) * Math.PI / 180) + 3) / 4;
  b = (cos((hue + 240) * Math.PI / 180) + 3) / 4;
  //clearRectangle(0, 0, screenWidth, screenHeight);
  angle += deltaT;
  var x = fx(angle, radA, radB, radC);
  var y = fy(angle, radA, radB, radC);

  fillCircle((x), (y), ptSize, makeColor(r,g,b,0.75));

}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
function fx(t, A, B, C) {
  var fxt = (A - B) * cos(t) + C * cos((A - B) / B * t);
  return xtrans(fxt);
}
function fy(t, A, B, C) {
  var fyt = (A - B) * sin(t) - C * sin((A - B) / B * t);
  return ytrans(fyt);
}
function xtrans(x) {
  var xt = x + screenWidth/2;
  return xt;
}
function ytrans(y) {
  var yt = y + screenHeight/2;
  return yt;
}
function InitializeDrawing() {
  radA = randomInteger(200, 350);
  radB = randomInteger(100, 250);
  radC =  randomInteger(20, 150);
  angle = 0;
  lastKeyCode = 0;
}
