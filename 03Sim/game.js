///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //
var TILE_DIM  = 128 / 4;


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //
var map;
var MAP_WIDTH = 1920 / TILE_DIM;
var MAP_HEIGHT = 1280 / TILE_DIM;
var mapColor = [makeColor(0.25,0.25,0.25), makeColor(0.9,0,0), makeColor(0,0.9,0), makeColor(0,0,0.9),
  makeColor(0.9,0.9,0), makeColor(0.9, 0, 0.9), makeColor(0,0.9,0.9), makeColor(0.9, 0.9, 0.9)];
var player = {x: 3, y: 1}

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //
function onSetup() {
  map = [];
  for (var x = 0; x < MAP_WIDTH; ++x) {
    map[x] = [];
    for (y = 0; y < MAP_HEIGHT; ++y) {
      map[x][y] = (x+y) % 5;
    }
  }
  console.log("w, h = (" + MAP_WIDTH + ", " + MAP_HEIGHT + ")");
}


function onKeyStart(key) {
  switch (key) {
    case 40:
      if (player.y < MAP_HEIGHT-1) { player.y++; }
      break;
    case 39:
      if (player.x < MAP_WIDTH-1) { player.x++; }
      break;
    case 38:
      if (player.y > 0) { player.y--; }
      break;
    case 37:
      if (player.x > 0) { player.x--; }
      break;
    default:
      console.log("key = " + key)
  }
}

// Called 30 times or more per second
function onTick() {
  clearRectangle(0, 0, screenWidth, screenHeight);

  for (var x = 0; x < MAP_WIDTH; ++x) {
    for (y = 0; y < MAP_HEIGHT; ++y) {
      strokeRectangle(x*TILE_DIM, y*TILE_DIM, TILE_DIM-1, TILE_DIM-1, mapColor[map[x][y]], 4);
      //fillRectangle(x*TILE_DIM, y*TILE_DIM, TILE_DIM-1, TILE_DIM-1, mapColor[map[x][y]], 4);
    }
  }
  fillRectangle(player.x*TILE_DIM, player.y*TILE_DIM, TILE_DIM, TILE_DIM, makeColor(1.0, 1.0, 1.0, 0.85), 1);
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
