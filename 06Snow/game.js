///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

var COUNT_SNOW = 100;
var COLOR_SNOWFLAKE = makeColor(1, 1, 1);
var COLOR_SKY = makeColor(0.5, 0.5, 1);
var COLOR_MOUNTAIN = makeColor(0.5, 0.5, 0.5);
var COLOR_TREES = makeColor( 4/255, 100/255,  4/255);
var COUNT_MOUNTAIN = 8;
var MOUNTAIN_WIDTH = screenWidth/4;
var MOUNTAIN_HEIGHT_OFFSET = 500;
var COUNT_TREES = 18;
var TREE_WIDTH = 100;
var TREE_HEIGHT_OFFSET = 300;

///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var lastKeyCode;
var snow = [];
var theWorld;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

// When setup happens...
function onSetup() {
  theWorld = new World;

  lastKeyCode = 0;
  var j;
  for (j=0; j < COUNT_SNOW; j++) {
    snow[j] = new Snowflake;
  }
}

function onKeyStart(key) {
    lastKeyCode = key;
}


// Called 30 times or more per second
function onTick() {
  theWorld.draw();
  var j;
  for (j=0; j < COUNT_SNOW; j++) {
    snow[j].draw();
    snow[j].move();
  }
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //

function World() {
  this.ptsMountain = [];
  this.trees = [];

  var bandHorz;
  var aPeak = []
  bandHorz = screenWidth / COUNT_MOUNTAIN;
  bandVert = screenWidth/3;
  for (var j=0; j < COUNT_MOUNTAIN; j++) {
    aPeak = [];

    aPeak = aPeak.concat(randomInteger(bandHorz*j, bandHorz*(j+1)),
                         randomInteger(bandVert - MOUNTAIN_HEIGHT_OFFSET, bandVert + MOUNTAIN_HEIGHT_OFFSET));
    //aPeak = aPeak.concat(randomInteger (j*bandHorz - bandHorz/2, j*bandHorz + bandHorz/2),
    //            screenHeight/2);
    aPeak = aPeak.concat(aPeak[0]+MOUNTAIN_WIDTH, screenHeight);
    aPeak = aPeak.concat(aPeak[0]-MOUNTAIN_WIDTH, screenHeight);
    this.ptsMountain.push(aPeak);
  }


  var atree = [];
  bandHorz = screenWidth / COUNT_TREES;
  for (var j=0; j < COUNT_TREES; j++) {
    atree = [];
    //atree = atree.concat(randomInteger (2*TREE_WIDTH, screenWidth-2*TREE_WIDTH),
    atree = atree.concat(randomInteger (j*bandHorz - bandHorz/2, j*bandHorz + bandHorz/2),
                        randomInteger(3*screenHeight/4, 3*screenHeight/4+TREE_HEIGHT_OFFSET));
    atree = atree.concat(atree[0]+TREE_WIDTH, screenHeight);
    atree = atree.concat(atree[0]-TREE_WIDTH, screenHeight);
    this.trees.push(atree);
  }
}
World.prototype.draw = function() {
  var j;
  fillRectangle(0, 0, screenWidth, screenHeight, COLOR_SKY);

  for (j=0; j < this.ptsMountain.length; j++) {
    fillPolygon(this.ptsMountain[j], COLOR_MOUNTAIN);
  }
  for (j=0; j < this.trees.length; j++) {
    fillPolygon(this.trees[j], COLOR_TREES);
  }
}

function Snowflake() {
  this.pos = {x:0, y:0}
  this.velY = 0;
  this.radius = 0;
  this.initialize();
  this.pos.y = randomInteger(0, screenHeight);
}

Snowflake.prototype.initialize = function() {
  this.pos.x = randomInteger(0, screenWidth);
  this.pos.y = 0;
  this.velY = randomInteger(1, 8);
  this.radius = randomInteger(2, 8);
}

Snowflake.prototype.draw = function() {
  fillCircle(this.pos.x, this.pos.y, this.radius, COLOR_SNOWFLAKE);
}
Snowflake.prototype.move = function() {
  if (this.pos.y < screenHeight) {
    this.pos.y += this.velY;
    this.pos.x += randomInteger(-2, 2);
  }
  else {this.initialize();}
}
