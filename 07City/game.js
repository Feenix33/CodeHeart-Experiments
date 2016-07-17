///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //
include("cmeColorCodeheart.js")


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //
/****
var theWorld = [
    [1, 1, 1, 1, 1, 3],
    [4, 5, 5, 0, 0, 7],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 8, 0, 2, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 2, 0, 3, 1]
  ];
*****/
var theWorld = [];
var sizeWorld = 20;
var maxHeightWorld = 10;
var colorTile = [LIME, LIGHTGREY, ORANGE, YELLOW, DARKGREY, BLUE, VIOLET, GREY, WHITE, GOLD, SILVER];
var Origin = {x:900, y:200}
var tileWidth = 40;
var tileHeight = tileWidth / 2;//20;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //
function onSetup() {
  createWorld();
}


// When a key is pushed
function onKeyStart(key) {
}

function createWorld() {
  var x, y, j, k;
  var line = [];

  for (x = 0; x < sizeWorld; x++) {
    line = [];
    for (y = 0; y < sizeWorld; y++) {
      line.push(0);
    }
    theWorld.push(line);
  }
  for (j = 0; j < 2*sizeWorld; j++) {
    x = randomInteger(0, sizeWorld-1);
    y = randomInteger(0, sizeWorld-1);
    k = randomInteger(1, maxHeightWorld);
    theWorld[x][y] = k;
  }
}

function createWorldA() {
  var x, y;
  var line = [];
  for (x = 0; x < sizeWorld; x++) {
    line = [];
    for (y = 0; y < sizeWorld; y++) {
      line.push(randomInteger(0, maxHeightWorld));
    }
    theWorld.push(line);
  }
}



function placeTile(x, y) {
  var xpos, ypos;
  var j, xo, yo;
  var ptsTop = [], ptsBot = [], ptsLeft = [], ptsRight = [];
  var ht;

  // Create the base
  xpos = x*tileWidth;
  ypos = y*tileWidth;
  ptsTop.push(xpos, ypos); // 1
  xpos += tileWidth;
  ptsTop.push(xpos, ypos); // 2
  ypos += tileWidth;
  ptsTop.push(xpos, ypos); // 3
  xpos -= tileWidth;
  ptsTop.push(xpos, ypos);  // 4
  for (j=0; j < ptsTop.length; j+=2) {
    xo = ptsTop[j];
    yo = ptsTop[j+1];
    ptsTop[j] = xo - yo;
    ptsTop[j+1] = (xo + yo) / 2;
  }

  // Create the top
  ht = tileHeight * theWorld[y][x];
  for (j=0; j < ptsTop.length; j+=2) {
    xo = ptsTop[j];
    yo = ptsTop[j+1] - ht;
    ptsBot.push(xo, yo);  // 4
  }

  // faces
  ptsLeft.push(ptsTop[6], ptsTop[7], ptsTop[4], ptsTop[5], ptsBot[4], ptsBot[5], ptsBot[6], ptsBot[7]);
  ptsRight.push(ptsTop[4], ptsTop[5], ptsTop[2], ptsTop[3], ptsBot[2], ptsBot[3], ptsBot[4], ptsBot[5]);


  /***
  ***/
  // Transformations
  for (j=0; j < ptsLeft.length; j+=2) {
    ptsLeft[j] += Origin.x;  ptsLeft[j+1] += Origin.y;
    ptsRight[j] += Origin.x; ptsRight[j+1] += Origin.y;
    ptsTop[j] += Origin.x;   ptsTop[j+1] += Origin.y;
    ptsBot[j] += Origin.x;   ptsBot[j+1] += Origin.y;
  }
  /***
  ***/
  var strokeWidth = 3;
  fillPolygon(ptsLeft, colorTile[theWorld[y][x]]);
  fillPolygon(ptsRight, colorTile[theWorld[y][x]]);
  //fillPolygon(ptsTop, colorTile[theWorld[y][x]]);
  fillPolygon(ptsBot, colorTile[theWorld[y][x]]);
  strokePolygon(ptsLeft, BLACK, strokeWidth, true);
  strokePolygon(ptsRight, BLACK, strokeWidth, true);
  strokePolygon(ptsBot, BLACK, strokeWidth, true);
}


// Called 30 times or more per second
function onTick() {
  var x, y;
  clearRectangle(0, 0, screenWidth, screenHeight);

  /***
  placeTile(0, 0);
  ***/
  for (y=0; y < theWorld.length; y++) {
    //for (x = theWorld[y].length-1; x >= 0; x--) {
    for (x=0; x < theWorld[y].length; x++) {
      placeTile(x, y);
    }
  }
}

///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
