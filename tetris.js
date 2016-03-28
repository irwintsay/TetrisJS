var tetrisGame = {};
var tetrisPiece = {};

tetrisGame.init = function($gameSpace) {
  this.space = [
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false,false]
  ];
  this.gameSpace = $gameSpace;
  tetrisPiece = {
    line: [0,0],
    square: [0,0],
    rightL: [0,0],
    leftL: [0,0],
    zigL: [0,0],
    zigR: [0,0],
    tee: [0,0]
  };
  this.currentPiece = [];
  this.nextPiece = this.getRandomPiece();
  this.startNow;
}

tetrisGame.getRandomPiece = function() {
  var pieces = ["line","square","rightL","leftL","zigL","zigR","tee"];
  return pieces[Math.floor(Math.random() * 7)];
}

tetrisGame.buildPiece = function() {
  var currentPieceShape = this.nextPiece;
  switch(currentPieceShape) {
    case "line":
      this.currentPiece = [[0,3],[0,4],[0,5],[0,6]];
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
    }
  }
}

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

// Very early prototype of currentPiece movement function
// It will definitely break when I start rotating pieces and introducing pile-up
tetrisGame.movePiece = function() {
  tetrisGame.clearPiece();
  if (!(tetrisGame.collisionFloor())) {
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;    // Increment each currentPiece coordinate X value by 1 to simulate downward movement
    }
    tetrisGame.paintPiece();
  } else {
    clearInterval(tetrisGame.startNow);
    tetrisGame.checkCompleteRow();
    tetrisGame.nextPiece = tetrisGame.getRandomPiece();
    tetrisGame.play();
  }
}

// Needs collision detection
tetrisGame.moveLeft = function() {
  if(!(tetrisGame.collisionSide('left'))) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][1]--;
    }
    tetrisGame.paintPiece();
  }
}

// Needs collision detection
tetrisGame.moveRight = function() {
  if(!(tetrisGame.collisionSide('right'))) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][1]++;
    }
    tetrisGame.paintPiece();
  }
}

// Needs collision detection
tetrisGame.moveDown = function() {
  if(!(tetrisGame.collisionFloorKeyDown())) {
    tetrisGame.clearPiece();
    for (var i = 0; i < tetrisGame.currentPiece.length; i++) {
      tetrisGame.currentPiece[i][0]++;
    }
    tetrisGame.paintPiece();
  }
}

// EXPERIMENTAL STUFF PROBABLY BROKEN
// I have to define collision detection for rotation function so that pieces
// don't clip through the wall during rotation
tetrisGame.moveRotate = function() {
  tetrisGame.clearPiece();

  // Choose an origin point for the current piece
  var origin = tetrisGame.currentPiece[0];
  // Origin point may change after a rotation

  // Translate coordinates to an origin point of (0,0)
  // So if current piece has an origin coordinate of (3,4), then I have to
  // subtract -3 and -4 from x and y respectively of each current piece
  // coordinate point
  var xShift = tetrisGame.currentPiece[0][0] - 0;           // This coordinate translating should be in it's own function
  var yShift = tetrisGame.currentPiece[0][1] - 0;
  for (var i = 1; i < tetrisGame.currentPiece.length; i++) {
    tetrisGame.currentPiece[i][0] -= xShift;
    tetrisGame.currentPiece[i][1] -= yShift;
  }

  // Rotate coordinates
  var rotatedX;
  var rotatedY;
  for (var i = 1; i < tetrisGame.currentPiece.length; i++) {  // Should probably be in it's own function as well
    rotatedX = tetrisGame.currentPiece[i][1];                 // New X should equal old Y
    rotatedY = tetrisGame.currentPiece[i][0] * -1;            // New Y should equal -(old X)
    tetrisGame.currentPiece[i][0] = rotatedX;
    tetrisGame.currentPiece[i][1] = rotatedY;
  }

  // Translate coordinates back to original orientation
  for ( var i = 1; i < tetrisGame.currentPiece.length; i++) {
    tetrisGame.currentPiece[i][0] += xShift;
    tetrisGame.currentPiece[i][1] += yShift;
  }
  tetrisGame.paintPiece();
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
    $rowHunt.eq(y).css("background-color","blue");
  } else {
    $rowHunt.eq(y).css("background-color","black");
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
  tetrisGame.startNow = setInterval(tetrisGame.movePiece, 500);

}

$(function() {
  var $gameSpace = $('.game-block');
  tetrisGame.init($gameSpace);
  tetrisGame.setInputHandler();
  // tetrisGame.play();
})
