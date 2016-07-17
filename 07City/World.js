
function makeTerrainType(name, color) {
  return {
    name : name,
    colorTile : color,
    base : [],
    left : [],
    right : [],
    height : 0
  };
}

var WATER = makeTerrainType("water", BLUE);
var GRASS = makeTerrainType("grass", GREEN);
var ROAD = makeTerrainType("road", BLACK);
var BUILDING0 = makeTerrainType("building0", GREY);
var BUILDING1 = makeTerrainType("building1", LIGHTGREY);
var BUILDING2 = makeTerrainType("building2", DARKGREY);
var ERROR = makeTerrainType("error", RED);

function createWorld() {
  var x, y, j, k;
  var waterLine = randomInteger(Math.floor(sizeWorld/2), sizeWorld-1);
  var line = [];
  var r, countBuilt, maxTimes;
  var countLand = 0;

  for (x = 0; x < sizeWorld; x++) {
    r = Math.random();
    if (r > 0.66667 && waterLine < sizeWorld) waterLine++;
    else if (r < 0.3333 && waterLine > 0) waterLine--;
    line = [];
    for (y = 0; y < sizeWorld; y++) {
      if (y < waterLine) {
        line.push(GRASS);
        countLand++;
      }
      else line.push(WATER);
    }
    theWorld.push(line);
  }

  //for (j = 0; j < 2*sizeWorld; j++) { }
  countBuilt = Math.round(countLand * percentBuildings);
  while (countBuilt > 0) {
    x = randomInteger(0, sizeWorld-1);
    y = randomInteger(0, sizeWorld-1);
    if (theWorld[y][x] == GRASS) {
      switch (randomInteger(0, 2)) {
        case 0: theWorld[y][x] = BUILDING0; break;
        case 1: theWorld[y][x] = BUILDING1; break;
        default: theWorld[y][x] = BUILDING2; break;
      }
      countBuilt--;
    }
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
  switch (theWorld[y][x]) {
    case WATER: ht = 0; break;
    case GRASS: ht = 1; break;
    case BUILDING0: ht = 3; break;
    case BUILDING1: ht = 6; break;
    case BUILDING2: ht = 9; break;
    default: ht = 9; break;
  }
  ht *= tileHeight;
  for (j=0; j < ptsTop.length; j+=2) {
    xo = ptsTop[j];
    yo = ptsTop[j+1] - ht;
    ptsBot.push(xo, yo);  // 4
  }

  // faces
  ptsLeft.push(ptsTop[6], ptsTop[7], ptsTop[4], ptsTop[5], ptsBot[4], ptsBot[5], ptsBot[6], ptsBot[7]);
  ptsRight.push(ptsTop[4], ptsTop[5], ptsTop[2], ptsTop[3], ptsBot[2], ptsBot[3], ptsBot[4], ptsBot[5]);


  // Transformations
  for (j=0; j < ptsLeft.length; j+=2) {
    ptsLeft[j] += Origin.x;  ptsLeft[j+1] += Origin.y;
    ptsRight[j] += Origin.x; ptsRight[j+1] += Origin.y;
    ptsTop[j] += Origin.x;   ptsTop[j+1] += Origin.y;
    ptsBot[j] += Origin.x;   ptsBot[j+1] += Origin.y;
  }
  fillPolygon(ptsLeft, theWorld[y][x].colorTile);
  fillPolygon(ptsRight, theWorld[y][x].colorTile);
  fillPolygon(ptsBot, theWorld[y][x].colorTile);

  strokePolygon(ptsLeft, BLACK, strokeWidth, true);
  strokePolygon(ptsRight, BLACK, strokeWidth, true);
  strokePolygon(ptsBot, BLACK, strokeWidth, true);
}
