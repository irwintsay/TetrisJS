console.log("scripts.js is locked and loaded baby");
var start;
$(function(){
  var $linePiece = $('#line-piece');
  var currentRot = 90;
  var rotated = false;

  var movePieceHandler = function() {
    $('body').keydown(function(e){
      switch (e.which) {
        case 32:
          $linePiece.css("transform","rotate(" + currentRot + "deg)");
          currentRot += 90;
          if(rotated) {
            rotated = false;
          } else {
            rotated = true;
          }
          break;
        case 37:
          $linePiece.css("left",
            (parseInt($linePiece.css("left")) - 20));
          break;
        case 39:
          $linePiece.css("left",
            (parseInt($linePiece.css("left")) + 20));
          break;
        case 38:
          $linePiece.css("top",
            (parseInt($linePiece.css("top")) - 20));
          break;
        case 40:
          $linePiece.css("top",
            (parseInt($linePiece.css("top")) + 20));
          break;
      }
    })
  }

  var automaticMove = function() {
    if(detectBoundary()) {
      $linePiece.css("top",(parseInt($linePiece.css("top")) + 20));
    }
  }
  var detectBoundary = function() {
    var boundaryClear = true;
    if(rotated) {
      if($linePiece.css("top") === "340px") {
        boundaryClear = false;
      }
    } else if ($linePiece.css("top") === "300px") {
      boundaryClear = false;
    }
    return boundaryClear;
  }
  movePieceHandler();
  // start = setInterval(automaticMove, 1000);
});
