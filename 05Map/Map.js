include("PriorityQueue.js");

/**
   moveCost: the cost of moving halfway across this type of node, i.e.,
   of moving onto or off of it. Set to Infinity to prevent movement
   through the node.
 */
//function NodeType(name, imageURL, moveCost) {
function NodeType(name, color, moveCost) {
    this.name     = name;
    //this.image    = loadImage(imageURL);
    this.moveCost = moveCost;
    this.color = color;
}


/** x, y are integer grid coordinates */
function Node(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
}


Node.prototype.toString = function() {
    return "Node(" + this.x + ", " + this.y + ")";
}



/** Creates a width x height map filled with the defaultNodeType. */
function Map(width, height, defaultNodeType, borderType) {
    this.width  = width;
    this.height = height;

    //console.log("Map dim = " + width + ", " + height);
    this.grid   = [];

    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            this.grid[x + y * width] = new Node(x, y, defaultNodeType);
        }
    }

    for (y = 0; y < height; ++y) {
        this.setType(0, y, borderType);
        this.setType(width - 1, y, borderType);
    }

    for (x = 0; x < width; ++x) {
        this.setType(x, 0, borderType);
        this.setType(x, height - 1, borderType);
    }

}


/** Returns true if (x, y) is a legal map position */
Map.prototype.inBounds = function(x, y) {
    return ((x == floor(x)) && (y == floor(y)) &&
            (x >= 0) && (y >= 0) &&
            (x < this.width) && (y < this.height));
}


Map.prototype.draw = function() {
    var x, y, i, color; //image;
    var colorBorder = makeColor(0, 0, 0);

    i = 0;
    for (y = 0; y < this.height; ++y) {
        for (x = 0; x < this.width; ++x) {
            //drawImage(this.grid[i].type.image, x * TILE_SIZE, y * TILE_SIZE - 40);
            //drawImage(this.grid[i].type.image, x * TILE_SIZE, y * TILE_SIZE - 40);
            fillRectangle(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE, this.grid[i].type.color);
            strokeRectangle(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE, colorBorder, 2);
            ++i;
        }
    }
}


/** return true if the spot is not infinity **/
Map.prototype.safe = function(x, y) {
  if (this.get(x,y).moveCost != Infinity) {
    return true;
  }
  return false;
}

/** Returns the Node at (x, y) */
Map.prototype.get = function(x, y) {
    if (! this.inBounds(x, y)) {
        throw new Error("(" + x + ", " + y + ") is not a legal map position");
    }

    return this.grid[x + y * this.width];
}


/** Sets the type of the Node at (x, y) */
Map.prototype.setType = function(x, y, type) {
    if (! this.inBounds(x, y)) {
        throw new Error("(" + x + ", " + y + ") is not a legal map position");
    }

    this.grid[x + y * this.width].type = type;
}


/** The "L1" norm of (a - b) */
function manhattanDistance(a, b) {
    return abs(a.x - b.x) + abs(a.y - b.y);
}
