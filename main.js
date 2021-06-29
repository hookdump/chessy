$(document).ready(function() {
    $(this).bind("contextmenu", function(e) {
        e.preventDefault();
    });

  var board = [];
  var tagged = {};
  var blocked = {}

  var index = {};
  var rows = ['8','7','6','5','4','3','2','1'];
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  currentPos = null;

  var initBoard = () => {
    board = [];
    tagged = {};
    $('.board').empty();

    var square = $("<div class='square'></div>");
    var addRow = (rowId) => {
      var row = $("<div class='row'></div>");
      board[rowId] = [];

      for (var i=0; i<8; i++) {
        var identifier = files[i] + rows[rowId];
        var newSquare = square
          .clone()
          .addClass(identifier)
          .append(`<span class='identifier'>${identifier}</span>`)
          .append(`<span class='txt'>-</span>`);
        row.append(newSquare);
        board[rowId][i] = identifier;
        index[identifier] = [rowId, i];
      }
      $('.board').append(row);
    }

    for (var i=0; i<8; i++) {
      addRow(i);
    }
    $(".square").on("mousedown", clickHandler);
  };

  var initPiece = (type, square) => {
    console.log(type, square);
    $("." + square).append(`<div class='piece piece-${type}'></div>`);
    $("." + square).find(".txt").html("&nbsp;");
  };

  var tagSquare = (type, x, y, val, steps, color=0) => {
    var sq = null;
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      sq = board[x][y];
      if (blocked[sq]) {
        console.log("Square " + sq + " is blocked!");
        return {};
      }
      if (!tagged[sq] || tagged[sq] > val) {
        var cur = $("." + sq).find(".txt").text();
        $("." + sq).find(".txt").text(val);
        $("." + sq).addClass("heat-" + val);
        tagged[sq] = val;
        if (steps > 0) {
          return {type: type, x: x, y: y, val: ++val, steps: --steps, color: color};
        }
      }
    }
  }

  var renderPath = (type, x, y, val, steps, color=0) => {
    var next = [];
    var move = 7;

    if ('K'.includes(type)) { // if type is King
        move = 1;
    }
    if ('N'.includes(type)) { // if type is a Knight
	next.push(tagSquare(type,x+1,y-2,val,steps,color=color));
	next.push(tagSquare(type,x+1,y+2,val,steps,color=color));
	next.push(tagSquare(type,x-1,y-2,val,steps,color=color));
	next.push(tagSquare(type,x-1,y+2,val,steps,color=color));
	next.push(tagSquare(type,x+2,y-1,val,steps,color=color));
	next.push(tagSquare(type,x+2,y+1,val,steps,color=color));
	next.push(tagSquare(type,x-2,y-1,val,steps,color=color));
	next.push(tagSquare(type,x-2,y+1,val,steps,color=color));
    }
    if ('KBQ'.includes(type)) { // if type is a King, Bishop, or Queen
        for (var i=1; i<=move; i++) { // push diagonals
            next.push(tagSquare(type,x-i,y-i,val,steps,color=color));
            next.push(tagSquare(type,x+i,y+i,val,steps,color=color));
            next.push(tagSquare(type,x-i,y+i,val,steps,color=color));
            next.push(tagSquare(type,x+i,y-i,val,steps,color=color));
        }
    }
    if ('KRQ'.includes(type)) { // if type is a King, Bishop or Queen
        for (var i=1; i<=move; i++) { // push files and colomns
            next.push(tagSquare(type,x,y-i,val,steps,color=color));
            next.push(tagSquare(type,x,y+i,val,steps,color=color));
            next.push(tagSquare(type,x-i,y,val,steps,color=color));
            next.push(tagSquare(type,x+i,y,val,steps,color=color));
        }
    }
    if ('P'.includes(type)) { // if type is a Pawn
        if (color == 0) { // if white
            move = 1
            if (x > 5) { // on the first movement
                move = 2 // allow double movement

                next.push(tagSquare(type,x-1,y,val,steps,color=color));  // Puts a 1 directly in front of pawn.
            }
        } else if (color == 1) { // if black
            move = -1
            if (x < 2) { // on the first movement
                move = -2 // allow double movement

                next.push(tagSquare(type,x+1,y,val,steps,color=color)); // Puts a 1 directly in front of pawn.
            }
	}
	    next.push(tagSquare(type,x-move,y,val,steps,color=color)); // Follows the double-step line.
    }
    next.forEach((sq) => {
        if (sq) renderPath(sq.type, sq.x, sq.y, sq.val, sq.steps, color=sq.color);
    });
  }

  function refresh(type, sq, color=0) { //Change color here. 0 for white 1 for black. Useful for pawns.
    console.log('REFRESH', sq);
    currentPos = sq;
    initBoard();
    initPiece(type, sq);
    var pos = index[sq];
    var x = pos[0];
    var y = pos[1];
    renderPath(type, x, y, 1, 6, color=color);
    var sprite = ['-', 'K', 'Q', 'B', 'N', 'R', 'P'].indexOf(type) + color * 6
    $('.piece').css("background-image", "url('img/sprites_" + sprite.toString().padStart(2, '0') + ".png')");
    $("." + sq).find(".txt").addClass("hide").html("&nbsp;");
    console.log(tagged);
  }

  function toggleBlock(type, sq) {
    if (blocked[sq]) {
      blocked[sq] = false;
    } else {
      blocked[sq] = true;
    }
    console.log("BLOCKED", blocked);
    refresh(type, currentPos);
  }

  function clickHandler(event) {
    var type = 'N' // Change pieces here 'K', 'Q', 'B', 'N', 'R', and 'P' are supported.
    var target = $(event.currentTarget);
    var id = target.find(".identifier").text();
    if (event.which == 1) {
      refresh(type, id);
    } else {
      event.preventDefault();
      toggleBlock(type, id);
    }
  }

  refresh('N', 'g1');
});
