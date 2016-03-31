// Declare tetrisGame Object
var tetrisGame = {};

// Audio Effects
tetrisGame.moveSound = new Audio("TetrisSound-Move.mp3");
tetrisGame.rotateSound = new Audio("TetrisSound-Rotate.mp3");
tetrisGame.landSound = new Audio("TetrisSound-Land.mp3");
tetrisGame.clearLineSound = new Audio("TetrisSound-ClearLine.mp3");
tetrisGame.tetrisSound = new Audio("TetrisSound-Tetris.mp3");


// Initialize Tetris Game
tetrisGame.init = function() {
  this.space = this.generateStartingBoard();
  this.currentPiece = [];
  this.currentShape;
  this.currentColor;
  this.nextPiece = this.getRandomPiece();
  this.startNow;
  this.lineCount = 0;
  this.levelCount = 0;
  this.playSpeed = 501;
  this.printScore(this.lineCount);
  this.printLevel(this.levelCount);
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
  this.updateBoard();
}

tetrisGame.printScore = function(howManyLines) {
  $('#score').text("Lines: " + howManyLines);
}

tetrisGame.printLevel = function(howManyLevels) {
  $('#level').text("Level: " + howManyLevels);
}

tetrisGame.clearPiece = function() {
  var x, y;
  for (var i = 0; i < this.currentPiece.length; i++) {
    x = this.currentPiece[i][0];
    y = this.currentPiece[i][1];
    this.space[x][y] = 0;
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
  if (howManyLines === 4) {
    tetrisGame.tetrisSound.play();      // Play Tetris sound if Tetris completed
  } else if (howManyLines > 0) {
    tetrisGame.clearLineSound.play();   // Play normal clear sound otherwise
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

  tetrisGame.updateBoard();
}


// Play speed increase is not working for some reason
tetrisGame.checkLevelCount = function(newLevelCount) {
  if (newLevelCount > tetrisGame.lineCount && tetrisGame.playSpeed > 0) {
    tetrisGame.playSpeed -= 100;
  }
  return newLevelCount;
}

// Controls the falling puzzle pieces
tetrisGame.fallingPiece = function() {
  if (!(tetrisGame.collisionFloor())) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;    // Increment each currentPiece coordinate X value by 1 to simulate downward movement
    }
    tetrisGame.paintPiece();
  } else {
    tetrisGame.landSound.play();          // Play sound effect for landing a puzzle piece
    clearInterval(tetrisGame.startNow);

    tetrisGame.lineCount += tetrisGame.checkCompleteRow();
    tetrisGame.printScore(tetrisGame.lineCount);

    tetrisGame.levelCount = tetrisGame.checkLevelCount(Math.floor(tetrisGame.lineCount / 10))
    tetrisGame.printLevel(tetrisGame.levelCount);

    if (tetrisGame.currentPiece[0][0] === 0 ||
        tetrisGame.currentPiece[1][0] === 0 ||
        tetrisGame.currentPiece[2][0] === 0 ||
        tetrisGame.currentPiece[3][0] === 0
    ) {
      tetrisGame.gameOverDisplay();
      tetrisGame.turnOffHandler($('body'));
    } else {
      tetrisGame.nextPiece = tetrisGame.getRandomPiece();
      tetrisGame.play();
    }
  }
}

// Experimental Space Bar function
tetrisGame.dropPieceNow = function() {
  while (!tetrisGame.collisionFloor()) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;    // Increment each currentPiece coordinate X value by 1 to simulate downward movement
    }
  }
  tetrisGame.paintPiece();
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

// Move puzzle piece down by 1 unit
tetrisGame.moveDown = function() {
  if(!(tetrisGame.collisionFloor())) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;
    }
    tetrisGame.paintPiece();
  }
}

// Rotate puzzle piece
tetrisGame.moveRotate = function() {
  this.clearPiece();
  this.currentPiece = this.translateOriginAndRotate(this.currentPiece);
  this.paintPiece();
}

// Rotate puzzle piece
// Choose an origin point among the puzzle piece's coordinates
// Translate that origin point to an origin of (0,0), store the distance to (0,0)
// Translate all puzzle piece coordinates based on distance to (0,0)
tetrisGame.translateOriginAndRotate = function(puzzlePiece) {
  var origin = puzzlePiece[0];                   // Choose an origin point, which is always stored in first element of array
  var xShift = origin[0] - 0;                    // Store x distance to 0
  var yShift = origin[1] - 0;                    // Store y distance to 0
  var x,y, rotatedX, rotatedY;
  for (var i = 1; i < puzzlePiece.length; i++) {  // Translate each coordinate according to distance from 0
    puzzlePiece[i][0] -= xShift;
    puzzlePiece[i][1] -= yShift;
  }
  // Rotate coordinates
  for (var i = 1; i < puzzlePiece.length; i++) {  // Rotate translated coordinates
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
  // Check for wall and block collision after rotation
  for (var i = 0; i < puzzlePiece.length; i++) {
    x = puzzlePiece[i][0];                        // Get the final rotated x,y coordinates
    y = puzzlePiece[i][1];                        // Check for collision with ceiling, sides, floor, and other blocks
    if (y < 0 || y > 9 || x < 0 || x > 19 || tetrisGame.space[x][y]) {
      console.log("Rotation collision");
      // If collision is detected, reverse the rotation and translation formulas
      // to arrive at original coordinates
      tetrisGame.reverseRotate(puzzlePiece, xShift, yShift);
    }
  }
  return puzzlePiece;
}

// Wow this is a really dumb way to implement rotation collision detection
// but it actually works... leaving it for now. Ideally I would like to simply
// store the original coordinates somewhere and replace the rotated coordinates
// when a rotation collision is detected
tetrisGame.reverseRotate = function(puzzlePiece, xShift, yShift) {
  for (var i = 1; i < puzzlePiece.length; i++) {
    puzzlePiece[i][0] -= xShift;
    puzzlePiece[i][1] -= yShift;
  }
  for (var i = 1; i < puzzlePiece.length; i++) {
    rotatedX = puzzlePiece[i][1] * -1;                 // New X should equal old Y
    rotatedY = puzzlePiece[i][0];                      // New Y should equal -(old X)
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

tetrisGame.paintDiv = function(x, y, shouldPaint) {
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
  } else {
    $rowHunt.eq(y).css({
      "background-color": "rgb(216,216,216)",
      "border": "1px solid rgb(191,191,191)"
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

// Set event handler for player controls:
// arrow keys up, down, left, right, and space bar
tetrisGame.setInputHandler = function() {
  $('body').keydown(function(e){
    switch (e.which) {
      case 32:
        tetrisGame.dropPieceNow();
        break;
      case 37:
        tetrisGame.moveSound.play();
        tetrisGame.moveLeft();
        break;
      case 39:
        tetrisGame.moveSound.play();
        tetrisGame.moveRight();
        break;
      case 38:
        tetrisGame.rotateSound.play();
        tetrisGame.moveRotate();
        break;
      case 40:
        tetrisGame.moveDown();
        break;
      case 77:
        $('#music').trigger("pause");
        break;

    }
  })
}

// Turn off event handler for given selector
tetrisGame.turnOffHandler = function(selector) {
  selector.off();
}

// Ready Play handler checks the text of the Ready/Game Over modal
// If the text reads "Click to play!", the handler waits for a mouse click to
// initialize the game and start playing the game.
// If the test reads "Game Over!", the handler waits for a mouse click to switch
// back to the "Click to play!" screen.
tetrisGame.setReadyPlayHandler = function() {
  $('.ready').click(function() {
    if ($('#display-text').text() === "Click to play!") {
      tetrisGame.init();
      tetrisGame.setInputHandler();
      tetrisGame.play();
      tetrisGame.animateReadyScreen(0);
      $('#music').attr("src","TetrisMusicA.ogg");     // Change music to Play music
    } else if ($('#display-text').text() === "Game Over!") {
      $('#display-text').text("Click to play!");
    }
  })
}

// Display Game Over screen modal, set Ready Play handler
tetrisGame.gameOverDisplay = function() {
  $('#display-text').text("Game Over!");
  this.animateReadyScreen(0.8);
  this.setReadyPlayHandler();
  $('#music').attr("src","TetrisSound-Scores.mp3");     // Change music to Game Over music
}

// Animate opacity change of the Ready/Game Over screen
tetrisGame.animateReadyScreen = function(opacityValue) {
  $('.ready').animate({
    opacity: opacityValue
  }, 1000)
}

tetrisGame.play = function() {
  this.turnOffHandler($('.ready'));
  tetrisGame.buildPiece();
  tetrisGame.startNow = setInterval(tetrisGame.fallingPiece, tetrisGame.playSpeed);
}

// On document load, animate the Ready screen and set Ready Play handler
$(function() {
  tetrisGame.animateReadyScreen(0.8);
  tetrisGame.setReadyPlayHandler();
})
