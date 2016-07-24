
function makeTerrainType(name, color) {
  return {
    name : name,
    colorTile : color,
    base : [],
    left : [],
    right : [],
  };
}

var WATER = makeTerrainType("water", BLUE);
var GRASS = makeTerrainType("grass", GREEN);
var ROAD = makeTerrainType("road", BLACK);
var BUILDING = makeTerrainType("building", GREY);
var ERROR = makeTerrainType("error", RED);
var BUILDINGA = makeTerrainType("buildingA", LIGHTGREY);
var BUILDINGB = makeTerrainType("buildingB", DARKGREY);
var BUILDINGC = makeTerrainType("buildingC", GREY25);
var BUILDINGE = makeTerrainType("buildingE", GREY50);
var BUILDINGD = makeTerrainType("buildingD", GREY75);

function WorldTile(tile) {
  return {
    typeTile : tile,
    height : 0
  }
}

function createWorld() {
  var x, y, j, k;
  var waterLine = randomInteger(Math.floor(sizeWorld/2), sizeWorld-1);
  var line = [];
  var r, countBuilt, maxTimes;

  countLand = 0;
  for (x = 0; x < sizeWorld; x++) {
    r = Math.random();
    if (r > 0.66667 && waterLine < sizeWorld) waterLine++;
    else if (r < 0.3333 && waterLine > 0) waterLine--;
    line = [];
    for (y = 0; y < sizeWorld; y++) {
      if (y < waterLine) {
        line.push(WorldTile(GRASS));
        countLand++;
      }
      else line.push(WorldTile(WATER));
    }
    theWorld.push(line);
  }

  growCity();
}

function growCity() {
  var x, y;
  var gridSize = 3;
  var buildings = [BUILDINGA, BUILDINGB, BUILDINGC, BUILDINGD, BUILDINGE]
  var nBuilding = buildings.length - 1;

  // make roads one direction
  for (x = 0; x < sizeWorld; x+=gridSize) {
    for (y = 0; y < sizeWorld; y+=1) {
      if (theWorld[y][x].typeTile == GRASS) {
        theWorld[y][x].typeTile = ROAD;
      }
    }
  }
  // make roads other direction
  for (x = 0; x < sizeWorld; x+=1) {
    for (y = 0; y < sizeWorld; y+=gridSize) {
      if (theWorld[y][x].typeTile == GRASS) {
        theWorld[y][x].typeTile = ROAD;
      }
    }
  }
  // grow some buildings
  // compute upper limit of building, higher near center
  var radiusWorld = theWorld.length / 2;
  var radiusBuilding;

  for (x = 0; x < sizeWorld; x+=1) {
    for (y = 0; y < sizeWorld; y+=1) {
      if (theWorld[y][x].typeTile == GRASS) {
        if(randomReal(0, 1) > probPark) {
          theWorld[y][x].typeTile = buildings[randomInteger(0,nBuilding)];//BUILDING;
          radiusBuilding = radiusWorld  - (Math.abs(y - radiusWorld) + Math.abs(x - radiusWorld)) * 0.7;
          if (radiusBuilding < 2) {radiusBuilding = 2;}
            theWorld[y][x].height = randomInteger(2, radiusBuilding);
        }
      }
    }
  }
  // Clean up roads against the water
  for (y = 0; y < sizeWorld; y+=1) {
    for (x = 1; x < sizeWorld; x+=1) {
      if ((theWorld[y][x].typeTile == WATER) && (theWorld[y][x-1].typeTile == ROAD)) {
        theWorld[y][x-1].typeTile = GRASS;
      }
    }
  }
  for (y = 0; y < sizeWorld; y+=1) {
    if (theWorld[y][sizeWorld-1].typeTile == ROAD) {
      theWorld[y][sizeWorld-1].typeTile = WATER;
    }
  }
}

function growCityOld() {
  var x, y;
  var countBuilt = Math.round(countLand * percentBuildings);

  while (countBuilt > 0) {
    x = randomInteger(0, sizeWorld-1);
    y = randomInteger(0, sizeWorld-1);
    if (theWorld[y][x].typeTile == GRASS) {
      theWorld[y][x].typeTile = BUILDING;
        theWorld[y][x].height = randomInteger(2, 12);
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
  ht = theWorld[y][x].height * tileHeight;
  /***
  switch (theWorld[y][x]) {
    case WATER: ht = 0; break;
    case GRASS: ht = 1; break;
    case BUILDING0: ht = 3; break;
    case BUILDING1: ht = 6; break;
    case BUILDING2: ht = 9; break;
    default: ht = 9; break;
  }
  ht *= tileHeight;
  ***/
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
  fillPolygon(ptsLeft, theWorld[y][x].typeTile.colorTile);
  fillPolygon(ptsRight, theWorld[y][x].typeTile.colorTile);
  fillPolygon(ptsBot, theWorld[y][x].typeTile.colorTile);

  strokePolygon(ptsLeft, BLACK, strokeWidth, true);
  strokePolygon(ptsRight, BLACK, strokeWidth, true);
  strokePolygon(ptsBot, BLACK, strokeWidth, true);
}
