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
      rowArray.push(false);
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
  var currentPieceShape = this.nextPiece;
  switch(currentPieceShape) {
    case "line":
      // this.currentPiece = [[0,3],[0,4],[0,5],[0,6]];
      this.currentPiece = [[0,4],[0,3],[0,5],[0,6]];    // Experimenting with placing origin coordinate first in array
      break;
    case "square":
      this.currentPiece = [[0,4],[0,5],[1,4],[1,5]];
      break;
    case "rightL":
      // this.currentPiece = [[0,3],[0,4],[0,5],[1,3]];
      this.currentPiece = [[0,4],[0,3],[0,5],[1,3]];     // Experimenting with placing origin coordinate first in array
      break;
    case "leftL":
      // this.currentPiece = [[0,3],[0,4],[0,5],[1,5]];
      this.currentPiece = [[0,4],[0,3],[0,5],[1,5]];    // Experimenting with placing origin coordinate first in array
      break;
    case "zigL":
      // this.currentPiece = [[0,3],[0,4],[1,4],[1,5]];
      this.currentPiece = [[1,4],[0,3],[0,4],[1,5]];    // Experimenting with placing origin coordinate first in array
      break;
    case "zigR":
      // this.currentPiece = [[0,4],[0,5],[1,3],[1,4]];
      this.currentPiece = [[1,4],[0,4],[0,5],[1,3]];    // Experimenting with placing origin coordinate first in array
      break;
    case "tee":
      // this.currentPiece = [[0,3],[0,4],[0,5],[1,4]];
      this.currentPiece = [[0,4],[0,3],[0,5],[1,4]];    // Experimenting with placing origin coordinate first in array
      break;
  }
  this.paintPiece();
}

tetrisGame.paintPiece = function() {
  var x, y;
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    this.space[x][y] = true;
  }
  this.updateBoard();
}

tetrisGame.printScore = function(howManyLines) {
  $('#score').text("Lines: " + howManyLines);
}

tetrisGame.clearPiece = function() {
  var x, y;
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    this.space[x][y] = false;
  }
  this.updateBoard();
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
    this.space[0][k] = false;
  }
  tetrisGame.updateBoard();
}

tetrisGame.fallingPiece = function() {
  tetrisGame.clearPiece();
  if (!(tetrisGame.collisionFloor())) {
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
      alert("YOU LOSE");
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
  if(!(tetrisGame.collisionFloorKeyDown())) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;
    }
    tetrisGame.paintPiece();
  }
}

// I have to implement collision detection for rotation function so that pieces
// don't clip through the wall during rotation
tetrisGame.moveRotate = function() {
  tetrisGame.clearPiece();

  // EXPERIMENTAL CODE
  var originalCoordinates = [];
  var x;
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i];
    originalCoordinates.push(x);
  }
  // EXPERIMENTAL CODE

  // Translate coordinate to new origin of (0,0) and assign to variable
  // Rotate coordinates and assign back to variable
  // Translate coordinates back to original orientation
  var pieceAndCollision = this.translateOriginAndRotate(this.currentPiece);
  // if(!pieceAndCollision[1]) {
  //   this.currentPiece = pieceAndCollision[0];
  // }
  this.currentPiece = pieceAndCollision[0];
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
  var pieceAndCollision = [];     // Store puzzle coordinate array and collision value
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
  pieceAndCollision.push(puzzlePiece, collision);
  console.log(pieceAndCollision[1]);
  return pieceAndCollision;
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
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    if ((x + 1) === 20) {
      collision = true;
      tetrisGame.paintPiece();    // I paint the current piece one last time here because if I don't, the piece won't "persist" after collision is detected
      console.log("collision");
    } else if (this.space[x + 1][y]) {
      collision = true;
      tetrisGame.paintPiece();    // Same as above. I have to paint the current piece one last time.
      console.log("collision");
    }
  }
  return collision;
}

// Obviously need to figure out a way to refactor this function with the other collisionFloor function
tetrisGame.collisionFloorKeyDown = function() {
  var collision = false;
  var x, y;
  tetrisGame.clearPiece();
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    if ((x + 1) === 20) {
      collision = true;
      console.log("wall collision below");
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

tetrisGame.paintDiv = function(x, y, shouldPaint) {
  var $rowHunt;
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
      "background-color": "blue",
      "border": "1px solid black"
    });
  } else {
    $rowHunt.eq(y).css({
      "background-color": '#D8D8D8',
      "border": "1px solid #BFBFBF"
    });
  }
}

tetrisGame.updateBoard = function() {
  for (var i = 0; i < this.space.length; i++) {
    for (var j = 0; j < this.space[i].length; j++) {
      if (this.space[i][j]) {
        this.paintDiv(i,j,true);
      } else {
        this.paintDiv(i,j,false);
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
