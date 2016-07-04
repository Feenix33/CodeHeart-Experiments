///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

include ("Map.js");
include ("findPath.js");


var TILE_SIZE = 64 / 2;
var COLOR_PATH = makeColor(0.9, 0.9, 0.9);
var VELOCITY = TILE_SIZE / 2;
var COUNT_MOVE = 1;;
var COUNT_WATER = 80 * 3;
var COUNT_ROCKS = 900;

var COLOR_CHARACTER = makeColor(255/255, 255/255,  2/255);
var COLOR_TARGET = makeColor(255/255,   5/255,  2/255);
var COLOR_FLOOR =  makeColor( 65/255,242/255, 42/255);
var COLOR_WALL = makeColor(0.5, 0.5, 0.5);
var COLOR_WATER = makeColor(0.2, 0.2, 1.0);
var COLOR_ROCKS = makeColor(165/255,  42/255,  42/255);


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var theMap;
var theCharacter;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
  buildMap();
  var x = 1, y = 1;

  if (!theMap.safe(x, y)) {
    x = randomInteger(1, theMap.width-2);
    y = randomInteger(1, theMap.height-2);
  }
  theCharacter = new Character(theMap, x, y, COLOR_CHARACTER);
  theCharacter.randomDestination();
  theCharacter.generatePath();
}


// When a key is pushed
function onKeyStart(key) {
  console.log('key='+key)
  if (key = 13) {
    //
  }
}


// Called 30 times or more per second
function onTick() {

  clearRectangle(0, 0, screenWidth, screenHeight);
  theMap.draw();
  theCharacter.move();
  theCharacter.draw(false);
  if (theCharacter.atDestination()) {
    theCharacter.randomDestination();
    theCharacter.generatePath();
  }
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //

function Character(map, x, y, color) {
  this.map = map;
  this.x = x;
  this.y = y;
  this.color = color;
  this.path = [];
  this.destination =  {x: x, y: y}
  this.target =  {x: x, y: y}
  this.dx = 0; this.dy = 0;
  this.velocity = VELOCITY;
  this.tickCount = 0;
}

Character.prototype.randomDestination = function() {
  var x, y;
  x = this.x;
  y = this.y;
  while (this.map.safe(x, y) && (x == this.x && y == this.y)) {
    x = randomInteger(1, this.map.width-2);
    y = randomInteger(1, this.map.height-2);
  }
  this.setDestination(x, y);
}

Character.prototype.setDestination = function(x, y) {
  this.destination =  {x: x, y: y}
}

Character.prototype.atDestination = function() {
  if ((this.x == this.destination.x) && (this.y == this.destination.y)) {
    return true;
  }
  if (this.path.length == null) {
    console.log("Emergency path generation");
    this.generatePath();
  }
  return false;
}

Character.prototype.generatePath = function() {
  if (this.atDestination()) {
    this.path = [];
  }
  else {
    this.path = findPath(this.map,
                               this.map.get(this.x, this.y),
                               this.map.get(this.destination.x, this.destination.y),
                               costEstimator, edgeCost, getNeighbors,
                               getNodeID);
    if (this.path.length == null) {
      console.log("Possibly no path could be found")
    }
    if (this.path.length != null && this.path.length > 1) {
      this.target.x = this.path[1].x;
      this.target.y = this.path[1].y;
    }
  }
}

Character.prototype.move = function() {
  if (this.path.length == null) return;

  var recompute = false;
  this.tickCount++;
  this.tickCount = COUNT_MOVE;
  if (this.tickCount >= COUNT_MOVE) {
    if (this.x > this.target.x) {
      this.dx -= VELOCITY;
      if (this.dx <= -TILE_SIZE) {
        this.dx += TILE_SIZE;
        this.x--;
        recompute = true;
      }
    }
    else if (this.x < this.target.x) {
      this.dx += VELOCITY;
      if (this.dx >= TILE_SIZE) {
        this.dx -= TILE_SIZE;
        this.x++;
        recompute = true;
      }
    }
    if (this.y > this.target.y) {
      this.dy -= VELOCITY;
      if (this.dy <= -TILE_SIZE) {
        this.dy += TILE_SIZE;
        this.y--;
        recompute = true;
      }
    }
    else if (this.y < this.target.y) {
      this.dy += VELOCITY;
      if (this.dy >= TILE_SIZE) {
        this.dy -= TILE_SIZE;
        this.y++;
        recompute = true;
      }
    }
    if (recompute) {
      this.generatePath();
    }
  }
}

Character.prototype.draw = function(pathToo) {
  var colorBorder = makeColor(0, 0, 0.9);
  var x, y;
  x = this.x*TILE_SIZE + this.dx;
  y = this.y*TILE_SIZE + this.dy;

  fillRectangle(x, y, TILE_SIZE, TILE_SIZE, this.color);
  strokeLine(x, y, x+TILE_SIZE-1, y+TILE_SIZE-1, colorBorder, 2);
  strokeLine(x, y+TILE_SIZE-1, x+TILE_SIZE-1, y, colorBorder, 2);

  x = this.destination.x*TILE_SIZE;
  y = this.destination.y*TILE_SIZE;

  fillRectangle(x, y, TILE_SIZE, TILE_SIZE, COLOR_TARGET);
  strokeLine(x, y, x+TILE_SIZE-1, y+TILE_SIZE-1, colorBorder, 2);
  strokeLine(x, y+TILE_SIZE-1, x+TILE_SIZE-1, y, colorBorder, 2);
  if (pathToo) { this.drawPath();}
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
function buildMap() {
  var TYPE_FLOOR = new NodeType("Floor", COLOR_FLOOR, 1);
  var TYPE_WALL = new NodeType("Wall", COLOR_WALL, Infinity);
  var TYPE_WATER = new NodeType("Water", COLOR_WATER, Infinity);
  var TYPE_ROCKS = new NodeType("Rocks", COLOR_ROCKS, 3);

  theMap = new Map(floor(screenWidth / TILE_SIZE), floor(screenHeight / TILE_SIZE), TYPE_FLOOR, TYPE_WALL);
  var j, x, y;
  for (j=0; j < COUNT_ROCKS; j++) {
    x = randomInteger(1, theMap.width-2);
    y = randomInteger(1, theMap.height-2);
    if (theMap.safe(x, y)) {
      theMap.setType(x, y, TYPE_ROCKS);
    }
  }

  for (j=0; j < COUNT_WATER; j++) {
    x = randomInteger(1, theMap.width-2);
    y = randomInteger(1, theMap.height-2);
    if (theMap.safe(x, y)) {
      theMap.setType(x, y, TYPE_WATER);
    }
  }
}
