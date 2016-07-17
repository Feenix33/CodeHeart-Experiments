///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //
include("cmeColorCodeheart.js")
include("World.js")


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //
var colorTile = [BLUE, LAWNGREEN, LIGHTGREY, DARKGREY, GREY, LIGHTGREY, GREY, LIGHTGREY, DARKGREY, GREY, WHITESMOKE];
var theWorld = [];
var sizeWorld = 40;
var maxHeightWorld = colorTile.length;
var Origin = {x:900, y:200}
var tileWidth = 20;
var tileHeight = tileWidth / 2;//20;
var percentBuildings = 0.50;
var strokeWidth = 2;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //
function onSetup() {
  createWorld();
}


// Called 30 times or more per second
function onTick() {
  var x, y;
  clearRectangle(0, 0, screenWidth, screenHeight);

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
