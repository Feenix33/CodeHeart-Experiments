///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

include ("Map.js");
include ("findPath.js");


var TILE_SIZE = 64;
var COLOR_PATH = makeColor(0.9, 0.9, 0.9);

///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var theMap;
var theCharacter;
var theTarget;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

// When setup happens...
function onSetup() {
  var FLOORTYPE = new NodeType("Floor", makeColor(165/255, 42/255, 42/255), 1);
  var WALLTYPE = new NodeType("Wall", makeColor(0.5, 0.5, 0.5), Infinity);
  theMap = new Map(floor(screenWidth / TILE_SIZE), floor(screenHeight / TILE_SIZE), FLOORTYPE, WALLTYPE);
  theCharacter = new Character(randomInteger(1, theMap.width-2), randomInteger(1, theMap.height-2), makeColor(255/255, 255/255,  2/255));
    theTarget = new Character(theCharacter.x, theCharacter.y, makeColor(  5/255, 255/255,  2/255));
  while (theTarget.x == theCharacter.x && theTarget.y == theCharacter.y) {
    theTarget.x = randomInteger(1, theMap.width-2);
    theTarget.y = randomInteger(1, theMap.height-2);
  }
  theCharacter.path = findPath(theMap,
                               theMap.get(theCharacter.x, theCharacter.y),
                               theMap.get(theTarget.x, theTarget.y),
                               costEstimator, edgeCost, getNeighbors,
                               getNodeID);
  if (theCharacter.path.length != null) { console.log("Path length = " + theCharacter.path.length);}
}


// When a key is pushed
function onKeyStart(key) {
  console.log('key='+key)
  /****
  if (theCharacter.path != null) {
    console.log('Character = (' + theCharacter.x + ', ' + theCharacter.y + ')'  );
    console.log('path[0] = (' + theCharacter.path[0].x + ', ' + theCharacter.path[0].y + ')'  );
    console.log('path[1] = (' + theCharacter.path[1].x + ', ' + theCharacter.path[1].y + ')'  );
  }
  ****/
  if (key == 13 && (theCharacter.path != null) && (theCharacter.path.length > 1)) {
    theCharacter.x = theCharacter.path[1].x;
    theCharacter.y = theCharacter.path[1].y;
    theCharacter.path = findPath(theMap,
                               theMap.get(theCharacter.x, theCharacter.y),
                               theMap.get(theTarget.x, theTarget.y),
                               costEstimator, edgeCost, getNeighbors,
                               getNodeID);
    if (theCharacter.path.length != null) { console.log("Path length = " + theCharacter.path.length);}
  }
}


// Called 30 times or more per second
function onTick() {

  clearRectangle(0, 0, screenWidth, screenHeight);
  theMap.draw();
  theCharacter.draw();
  theTarget.draw();
  theCharacter.drawPath();
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //

function Character(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.path = [];
}

Character.prototype.draw = function() {
  var colorBorder = makeColor(0, 0, 0.9);
  var x, y;
  x = this.x; y = this.y;

  fillRectangle(this.x*TILE_SIZE, this.y*TILE_SIZE, TILE_SIZE, TILE_SIZE, this.color);
  strokeLine(x*TILE_SIZE, y*TILE_SIZE, (x+1)*TILE_SIZE-1, (y+1)*TILE_SIZE-1, colorBorder, 2);
  strokeLine(x*TILE_SIZE, (y+1)*TILE_SIZE-1, (x+1)*TILE_SIZE-1, y*TILE_SIZE, colorBorder, 2);
}
Character.prototype.drawPath = function() {
  var i=0;
  var node1, node2;

  if (this.path != null) {
    for (i=0; i < this.path.length-1; ++i) {
      node1 = this.path[i];
      node2 = this.path[i+1];
      strokeLine((node1.x + 0.5) * TILE_SIZE, (node1.y+0.5) * TILE_SIZE,
                 (node2.x + 0.5) * TILE_SIZE, (node2.y+0.5) * TILE_SIZE,
               COLOR_PATH, 3);
    }
  }
}


function costEstimator(map, a, b) {
  return manhattanDistance(a, b) * 2 * min(a.type.moveCost, b.type.moveCost);
}

function edgeCost(map, a, b) {
  if (manhattanDistance(a,b) != 1) {
    throw new Error("nodes " + a + " and " + b + " are not neighbors.");
  }
  return a.type.moveCost + b.type.moveCost;
}

function getNodeID(map, node) {
  return node.x + node.y * map.width;
}

function getNeighbors(map, node) {
  var neighbors = [];

  if ((node.x > 0) && (map.get(node.x - 1, node.y).type.moveCost < Infinity)) {
    insertBack(neighbors, map.get(node.x-1, node.y));
  }
  if ((node.y > 0) && (map.get(node.x, node.y - 1).type.moveCost < Infinity)) {
    insertBack(neighbors, map.get(node.x, node.y-1));
  }
  if ((node.x < map.width-1) && (map.get(node.x + 1, node.y).type.moveCost < Infinity)) {
    insertBack(neighbors, map.get(node.x+1, node.y));
  }
  if ((node.y < map.height-1) && (map.get(node.x, node.y + 1).type.moveCost < Infinity)) {
    insertBack(neighbors, map.get(node.x, node.y+1));
  }
  return neighbors;
}

/******************
******************/
