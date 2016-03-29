// Declare tetrisGame Object
var tetrisGame = {};

tetrisGame.init = function($gameSpace) {
  // this.space = [
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false],
  //   [false,false,false,false,false,false,false,false,false,false]
  // ];
  this.space = this.generateStartingBoard();
  this.gameSpace = $gameSpace;
  this.currentPiece = [];
  this.currentShape;    // Test-branch code
  this.currentColor;
  this.nextPiece = this.getRandomPiece();
  this.startNow;
  this.lineCount = 0;
}

// Create blank Tetris game space. Push an array of 10 false values, 20 times total.
tetrisGame.generateStartingBoard = function() {
  var gameArray = [];
  for (var i = 0; i < 20; i++) {
    var rowArray = [];
    for (var j = 0; j < 10; j++) {
      rowArray.push(0);
    }
    gameArray.push(rowArray);
  }
  return gameArray;
}
// Randomly choose a new Tetromino piece
tetrisGame.getRandomPiece = function() {
  var pieces = ["line","square","rightL","leftL","zigL","zigR","tee"];
  return pieces[Math.floor(Math.random() * 7)];
}

tetrisGame.buildPiece = function() {
  this.currentShape = this.nextPiece;
  // Placed the origin coordinate first in each shape array
  switch(this.currentShape) {
    case "line":
      this.currentPiece = [[0,4],[0,3],[0,5],[0,6]];
      this.currentColor = 1;
      break;
    case "square":
      this.currentPiece = [[0,4],[0,5],[1,4],[1,5]];
      this.currentColor = 2;
      break;
    case "rightL":
      this.currentPiece = [[0,4],[0,3],[0,5],[1,3]];
      this.currentColor = 3;
      break;
    case "leftL":
      this.currentPiece = [[0,4],[0,3],[0,5],[1,5]];
      this.currentColor = 4;
      break;
    case "zigL":
      this.currentPiece = [[1,4],[0,3],[0,4],[1,5]];
      this.currentColor = 5;
      break;
    case "zigR":
      this.currentPiece = [[1,4],[0,4],[0,5],[1,3]];
      this.currentColor = 6;
      break;
    case "tee":
      this.currentPiece = [[0,4],[0,3],[0,5],[1,4]];
      this.currentColor = 7;
      break;
  }
  this.paintPiece();
}

// Pass in color code of 1 through 7 and return the RGB color value for that
// code
tetrisGame.getRGBColor = function(colorCode) {
  var rgbColor;
  switch(colorCode) {
    case 0:
    rgbColor = "rgb(216,216,216)";
    break;
    case 1:
    rgbColor = "rgb(0,240,240)";
    break;
    case 2:
    rgbColor = "rgb(241,239,47)";
    break;
    case 3:
    rgbColor = "rgb(221,164,34)";
    break;
    case 4:
    rgbColor = "rgb(0,0,240)";
    break;
    case 5:
    rgbColor = "rgb(207,54,22)";
    break;
    case 6:
    rgbColor = "rgb(138,234,40)";
    break;
    case 7:
    rgbColor = "rgb(136,44,237)";
    break;
  }
  return rgbColor;
}

tetrisGame.paintPiece = function() {
  var x, y;
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    this.space[x][y] = this.currentColor;
  }
  this.updateBoard(false);
}

tetrisGame.printScore = function(howManyLines) {
  $('#score').text("Lines: " + howManyLines);
}

tetrisGame.clearPiece = function() {
  var x, y;
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    this.space[x][y] = 0;
  }
  this.updateBoard(false);
}

// Find completed rows in game space
tetrisGame.checkCompleteRow = function() {
  var howManyLines = 0;       // Keep track of how many lines are cleared for score keeping

  function isAllTrue(element) {
    return element;
  }
  for (var i = 0; i < this.space.length; i++) {
    if (this.space[i].every(isAllTrue)) {
      this.clearCompleteRow(i);
      howManyLines++;
    }
  }
  return howManyLines;
}

// Take in completed row as argument, clear that row and take everything above
// and shift it down by 1
tetrisGame.clearCompleteRow = function(completedRow) {
  for (var i = completedRow; i > 0; i--) {          // Start at the completed row and work your way down
    for (var j = 0; j < this.space[i].length; j++) {
      this.space[i][j] = this.space[i - 1][j];
    }
  }
  for (var k = 0; k < this.space[0].length; k++) {
    this.space[0][k] = 0;
  }
  tetrisGame.updateBoard(true);
}

tetrisGame.fallingPiece = function() {
  // tetrisGame.clearPiece();
  if (!(tetrisGame.collisionFloor())) {
    // New
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;    // Increment each currentPiece coordinate X value by 1 to simulate downward movement
    }
    tetrisGame.paintPiece();
  } else {
    clearInterval(tetrisGame.startNow);

    tetrisGame.lineCount += tetrisGame.checkCompleteRow();
    tetrisGame.printScore(tetrisGame.lineCount);

    if (tetrisGame.currentPiece[0][0] === 0 ||
        tetrisGame.currentPiece[1][0] === 0 ||
        tetrisGame.currentPiece[2][0] === 0 ||
        tetrisGame.currentPiece[3][0] === 0
    ) {
      $('#lost').text("YOU LOSE");
    } else {
      tetrisGame.nextPiece = tetrisGame.getRandomPiece();
      tetrisGame.play();
    }
  }
}

tetrisGame.moveLeft = function() {
  if(!(tetrisGame.collisionSide('left'))) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][1]--;
    }
    tetrisGame.paintPiece();
  }
}

tetrisGame.moveRight = function() {
  if(!(tetrisGame.collisionSide('right'))) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][1]++;
    }
    tetrisGame.paintPiece();
  }
}

tetrisGame.moveDown = function() {
  if(!(tetrisGame.collisionFloor())) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;
    }
    tetrisGame.paintPiece();
  }
}

tetrisGame.moveRotate = function() {
  tetrisGame.clearPiece();
  // Translate coordinate to new origin of (0,0) and assign to variable
  // Rotate coordinates and assign back to variable
  // Translate coordinates back to original orientation
  this.currentPiece = this.translateOriginAndRotate(this.currentPiece);
  tetrisGame.paintPiece();
}

tetrisGame.translateOriginAndRotate = function(puzzlePiece) {
  // Pick an origin point, find distance to (0,0), translate coordinates to a
  // new origin point of (0,0).
  // i.e. if current piece has an origin coordinate of (3,4), then I have to
  // subtract -3 and -4 from x and y respectively of each current coordinate point
  var origin = puzzlePiece[0];
  var xShift = origin[0] - 0;
  var yShift = origin[1] - 0;
  var collision = false;
  var x,y;
  for (var i = 1; i < puzzlePiece.length; i++) {
    puzzlePiece[i][0] -= xShift;
    puzzlePiece[i][1] -= yShift;
  }
  // Rotate coordinates
  var rotatedX;     // New X value
  var rotatedY;     // New Y value
  for (var i = 1; i < puzzlePiece.length; i++) {  // Should probably be in it's own function as well
    rotatedX = puzzlePiece[i][1];                 // New X should equal old Y
    rotatedY = puzzlePiece[i][0] * -1;            // New Y should equal -(old X)
    puzzlePiece[i][0] = rotatedX;
    puzzlePiece[i][1] = rotatedY;
  }
  // Translate coordinates with x and y shift values
  for (var i = 1; i < puzzlePiece.length; i++) {
    puzzlePiece[i][0] += xShift;
    puzzlePiece[i][1] += yShift;
  }
  for (var i = 0; i < puzzlePiece.length; i++) {
    x = puzzlePiece[i][0];
    y = puzzlePiece[i][1];
    if (y < 0 || y > 9) {
      collision = true;
      console.log("R collision with side");
      tetrisGame.reverseRotate(puzzlePiece, xShift, yShift);
    } else if (x < 0) {
      collision = true;
      console.log("R collision with ceiling");
      tetrisGame.reverseRotate(puzzlePiece, xShift, yShift);
    } else if (x > 19) {
      collision = true;
      console.log("R collision with floor");
      tetrisGame.reverseRotate(puzzlePiece, xShift, yShift);
    } else if (tetrisGame.space[x][y]) {
      collision = true;
      console.log("R collision with block");
      tetrisGame.reverseRotate(puzzlePiece, xShift, yShift);
    }
  }
  return puzzlePiece;
}

// EXPERIMENTAL CODE
// Wow this is a really dumb way to implement rotation collision detection
// but it actually works... leaving it for now, but ideally I would like to do
// this with way less code.
tetrisGame.reverseRotate = function(puzzlePiece, xShift, yShift) {
  for (var i = 1; i < puzzlePiece.length; i++) {
    puzzlePiece[i][0] -= xShift;
    puzzlePiece[i][1] -= yShift;
  }
  for (var i = 1; i < puzzlePiece.length; i++) {  // Should probably be in it's own function as well
    rotatedX = puzzlePiece[i][1] * -1;                 // New X should equal old Y
    rotatedY = puzzlePiece[i][0];            // New Y should equal -(old X)
    puzzlePiece[i][0] = rotatedX;
    puzzlePiece[i][1] = rotatedY;
  }
  for (var i = 1; i < puzzlePiece.length; i++) {
    puzzlePiece[i][0] += xShift;
    puzzlePiece[i][1] += yShift;
  }
}

tetrisGame.collisionFloor = function() {
  var collision = false;
  var x, y;
  tetrisGame.clearPiece();
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    if ((x + 1) === 20) {
      collision = true;
      console.log("boundary collision below");
    } else if (this.space[x + 1][y]) {
      collision = true;
      console.log("block collision below");
    }
  }
  tetrisGame.paintPiece();
  return collision;
}

// Check for collision to the left or right of the current piece
// Pass in the side (left or right) to check for collision
tetrisGame.collisionSide = function(side) {
  var collision = false;
  var x, y;
  tetrisGame.clearPiece();
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    if (side === 'left' && y === 0) {
      collision = true;
      console.log("left wall collision");
    } else if (side === 'right' && y === 9) {
      collision = true;
      console.log("right wall collision");
    } else if (side === 'left' && (this.space[x][y - 1])) {
      collision = true;
      console.log("left block collision");
    } else if (side === 'right' && (this.space[x][y + 1])) {
      collision = true;
      console.log("right block collision");
    }
  }
  tetrisGame.paintPiece();
  return collision;
}

tetrisGame.paintDiv = function(x, y, shouldPaint, overWrite) {
  var $rowHunt;
  var color = this.getRGBColor(this.currentColor);
  switch(x) {
    case 0:
      $rowHunt = $('#r1').children();
      break;
    case 1:
      $rowHunt = $('#r2').children();
      break;
    case 2:
      $rowHunt = $('#r3').children();
      break;
    case 3:
      $rowHunt = $('#r4').children();
      break;
    case 4:
      $rowHunt = $('#r5').children();
      break;
    case 5:
      $rowHunt = $('#r6').children();
      break;
    case 6:
      $rowHunt = $('#r7').children();
      break;
    case 7:
      $rowHunt = $('#r8').children();
      break;
    case 8:
      $rowHunt = $('#r9').children();
      break;
    case 9:
      $rowHunt = $('#r10').children();
      break;
    case 10:
      $rowHunt = $('#r11').children();
      break;
    case 11:
      $rowHunt = $('#r12').children();
      break;
    case 12:
      $rowHunt = $('#r13').children();
      break;
    case 13:
      $rowHunt = $('#r14').children();
      break;
    case 14:
      $rowHunt = $('#r15').children();
      break;
    case 15:
      $rowHunt = $('#r16').children();
      break;
    case 16:
      $rowHunt = $('#r17').children();
      break;
    case 17:
      $rowHunt = $('#r18').children();
      break;
    case 18:
      $rowHunt = $('#r19').children();
      break;
    case 19:
      $rowHunt = $('#r20').children();
      break;
  }
  if (shouldPaint) {
    $rowHunt.eq(y).css({
      "background-color": this.getRGBColor(this.space[x][y]),
      "border": "1px solid black"
    });
    // EXPERIMENTAL
    // if ($rowHunt.eq(y).css("background-color") === "rgb(216, 216, 216)") {
    //   $rowHunt.eq(y).css({
    //     "background-color": color,
    //     "border": "1px solid black"
    //   });
    // } else if (overWrite) {
    //   $rowHunt.eq(y).css({
    //     "background-color": this.getRGBColor(y),
    //     "border": "1px solid black"
    //   });
    // }
  } else {
    $rowHunt.eq(y).css({
      "background-color": "rgb(216,216,216)",
      "border": "1px solid rgb(191,191,191)"
    });
  }
}

tetrisGame.updateBoard = function(overWrite) {
  for (var i = 0; i < this.space.length; i++) {
    for (var j = 0; j < this.space[i].length; j++) {
      if (this.space[i][j]) {
        this.paintDiv(i,j,true,overWrite);
      } else {
        this.paintDiv(i,j,false,overWrite);
      }
    }
  }
}

tetrisGame.setInputHandler = function() {
  $('body').keydown(function(e){
    switch (e.which) {
      case 32:
        // Code for space bar
        // Drop current piece to lowest possible point
        break;
      case 37:
        tetrisGame.moveLeft();
        break;
      case 39:
        tetrisGame.moveRight();
        break;
      case 38:
        tetrisGame.moveRotate();
        break;
      case 40:
        tetrisGame.moveDown();
        break;
    }
  })
}

tetrisGame.play = function() {
  tetrisGame.buildPiece();
  tetrisGame.startNow = setInterval(tetrisGame.fallingPiece, 500);
}

$(function() {
  var $gameSpace = $('.game-block');
  tetrisGame.init($gameSpace);
  tetrisGame.setInputHandler();
  tetrisGame.play();
})
