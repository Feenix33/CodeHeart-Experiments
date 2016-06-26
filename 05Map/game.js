///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

var sizeTILE =  16; // 64;
var typeWALL = 0;
var typeFLOOR = 1;
var typeWATER = 2;
var numberWATER = 25;
var sizeBORDER = 1;

///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var gMap;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

// When setup happens...
function onSetup() {
  gMap = new cmeMap (floor(screenWidth / sizeTILE), floor(screenHeight / sizeTILE), typeFLOOR, typeWALL);
}


// When a key is pushed
function onKeyStart(key) {
}


// Called 30 times or more per second
function onTick() {

  clearRectangle(0, 0, screenWidth, screenHeight);
  gMap.draw();

}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
function cmeMap(width, height, typeDefault, typeBorder) {
  var x, y, j;
  this.width = width;
  this.height = height;

  console.log ("Map dim = " + width + ", " + height);

  this.grid = [];

  for (y=0; y < height; ++y) {
    for (x=0; x < width; ++x) {
      this.grid[x + y * width] = typeDefault;
    }
  }
  for (y=0; y < height; ++y) {
    this.setType(0, y, typeBorder);
    this.setType(width-1, y, typeBorder);
  }
  for (x=0; x < width; ++x) {
    this.setType(x, 0, typeBorder);
    this.setType(x, height-1, typeBorder);
  }

  for (j=0; j < numberWATER; j++) {
    x = randomInteger(1, width-2);
    y = randomInteger(1, height-2);
    this.setType(x, y, typeWATER);
  }
}
cmeMap.prototype.draw = function() {
  var x, y, colorFill, colorBorder, colorBox, colorWater;
  colorDefault = makeColor(0.2, 0.9, 0.2);
  colorBorder = makeColor(0.5, 0.5, 0.5);
  colorWater = makeColor(0.2, 0.2, 0.9);
  colorBox = makeColor(0, 0, 0);

  for (y=0; y < this.height; ++y) {
    for (x=0; x < this.width; ++x) {
      if (this.get(x, y) == typeFLOOR) {
        fillRectangle(x*sizeTILE, y*sizeTILE, sizeTILE, sizeTILE, colorDefault);
      }
      else if (this.get(x, y) == typeWATER){
        fillRectangle(x*sizeTILE, y*sizeTILE, sizeTILE, sizeTILE, colorWater);
      }
      else {
        fillRectangle(x*sizeTILE, y*sizeTILE, sizeTILE, sizeTILE, colorBorder);
      }
      strokeRectangle(x*sizeTILE, y*sizeTILE, sizeTILE, sizeTILE, colorBox, sizeBORDER);
    }
  }
}

cmeMap.prototype.inBounds = function(x, y) {
  return ((x == floor(x)) && (y == floor(y)) &&
          (x >= 0) && (y >= 0) &&
          (x < this.width) && (y < this.height));
}
cmeMap.prototype.get = function(x, y) {
  if (! this.inBounds(x, y)) {
    throw new Error("(" + x + ", " + y + ") bad arguments in cmeMap.get()");
  }
  return this.grid[x + y*this.width];
}
cmeMap.prototype.setType = function(x, y, type) {
  if (! this.inBounds(x, y)) {
    throw new Error("(" + x + ", " + y + ") bad arguments in cmeMap.set()");
  }
  this.grid[x + y*this.width] = type;
}
