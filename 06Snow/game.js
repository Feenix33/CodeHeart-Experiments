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
var COUNT_TREES = 28;
var TREE_WIDTH_MIN =  50;
var TREE_WIDTH_MAX =  80;
var TREE_HEIGHT_OFFSET = 400;

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
  this.trees = {tops:[], color:[]}
  this.mountains = {peak:[], color:[]}

  var aPeak = []
  var mtColor;
  bandVert = screenWidth/3;

  peakBand = screenWidth/100;
  for (var j=0; j < COUNT_MOUNTAIN; j++) {
    aPeak = [];

    aPeak = aPeak.concat(randomInteger(0, peakBand) * 100,
                         randomInteger(bandVert - MOUNTAIN_HEIGHT_OFFSET, bandVert + MOUNTAIN_HEIGHT_OFFSET));
    aPeak = aPeak.concat(aPeak[0]+MOUNTAIN_WIDTH, screenHeight);
    aPeak = aPeak.concat(aPeak[0]-MOUNTAIN_WIDTH, screenHeight);
    this.mountains.peak.push(aPeak);
    mtColor = randomInteger(64, 167)/255;
    this.mountains.color.push(makeColor(mtColor, mtColor, mtColor));
  }


  var atree = [];
  var treeRange = screenWidth / 20;
  var treeWidth;
  for (var j=0; j < COUNT_TREES; j++) {
    atree = [];
  treeWidth = randomInteger (TREE_WIDTH_MIN, TREE_WIDTH_MAX);
    atree = atree.concat(randomInteger (0, treeRange)*20,
                        randomInteger(3*screenHeight/4, 3*screenHeight/4+TREE_HEIGHT_OFFSET));
    atree = atree.concat(atree[0]+treeWidth, screenHeight);
    atree = atree.concat(atree[0]-treeWidth, screenHeight);
    this.trees.tops.push(atree);
    greenShade = randomInteger( 64,255);
    brightness = randomInteger(0, greenShade/2)/255;
    greenShade = greenShade/255;
    this.trees.color.push(makeColor(brightness, greenShade, brightness));
  }
}
World.prototype.draw = function() {
  var j;
  fillRectangle(0, 0, screenWidth, screenHeight, COLOR_SKY);

  for (j=0; j < this.mountains.peak.length; j++) {
    fillPolygon(this.mountains.peak[j], this.mountains.color[j]);
  }
  for (j=0; j < this.trees.tops.length; j++) {
    fillPolygon(this.trees.tops[j], this.trees.color[j]);
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
