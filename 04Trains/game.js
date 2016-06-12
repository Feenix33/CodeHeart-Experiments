///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //
var SPRITESHEET       = loadImage("roguelikeCity.png");
var MAPW = 10;
var MAPH = 8;
var TPR = 37; // tiles per row


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //
var Map; // = new Array(MAPW);


///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
  //for (var i=0; i < MAPW; i++) {
  //  Map[i] = new Array(MAPH);
  //}
  Map = [ [ [0,0], [0,2], [0,2], [0,2], [0,2], [0,2], [0,2], [0,1]],
          [ [0,3], [0,6], [0,6], [0,6], [0,6], [0,6], [0,6], [1,3]],
          [ [1,0], [1,2], [1,2], [1,2], [1,2], [1,2], [1,2], [1,1]],
          [ [5,1], [5,2], [5,2], [5,2], [5,2], [5,2], [5,2], [5,3]],
          [ [6,1], [6,2], [6,2], [6,2], [6,2], [6,2], [6,2], [6,3]],
          [ [5,1], [5,2], [5,2], [5,2], [5,2], [5,2], [5,2], [5,3]],
          [ [10,1], [10,2], [10,2], [10,2], [10,2], [10,2], [10,2], [10,3]]
        ];
  Decor = [ // sprite r c, image r, c
    [[16, 25], [4, 1]],
    [[16, 26], [4, 2]],
    [[16, 27], [4, 3]],
    [[16, 27], [4, 4]],
    [[16, 26], [4, 5]],
    [[16, 25], [4, 6]],
    [[23, 27], [6, 3]],
    [[23, 28], [6, 4]],
    [[14, 27], [1, 2]],
    [[14, 29], [1, 6]],
  ];
}


function onKeyStart(key) {
}


function onTick() {
    clearRectangle(0, 0, screenWidth, screenHeight);
    drawImage(SPRITESHEET, 0, 0,  1*SPRITESHEET.width, 1*SPRITESHEET.height,
      0, 0, SPRITESHEET.width, SPRITESHEET.height, 1, false);
    for (var r=0; r < Map.length; r++) {
      for (var c=0; c < Map[r].length; c++) {
        var spriteRow = Map[r][c][0] * (16+1);
        var spriteCol = Map[r][c][1] * (16+1);
        var mag=6;
        drawImage(SPRITESHEET, 700+16*mag*c, 16*mag*r, 16*mag, 16*mag, spriteCol, spriteRow, 16, 16);
      }
    }
    for (var d=0; d < Decor.length; d++) {
        spriteRow = Decor[d][0][0] * (16+1);
        spriteCol = Decor[d][0][1] * (16+1);
        r = Decor[d][1][0];
        c = Decor[d][1][1];
        drawImage(SPRITESHEET, 700+16*mag*c, 16*mag*r, 16*mag, 16*mag, spriteCol, spriteRow, 16, 16);
    }
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //
