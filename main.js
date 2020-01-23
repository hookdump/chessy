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

  var tagSquare = (x, y, val, steps) => {
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
          return {x: x, y: y, val: ++val, steps: --steps};
        }
      }
    }
  }

  var renderPath = (x, y, val, steps) => {
    var next = [];

    // knight!
    next.push(tagSquare(x+1,y-2,val,steps));
    next.push(tagSquare(x+1,y+2,val,steps));
    next.push(tagSquare(x-1,y-2,val,steps));
    next.push(tagSquare(x-1,y+2,val,steps));
    next.push(tagSquare(x+2,y-1,val,steps));
    next.push(tagSquare(x+2,y+1,val,steps));
    next.push(tagSquare(x-2,y-1,val,steps));
    next.push(tagSquare(x-2,y+1,val,steps));

    next.forEach((sq) => {
      if (sq) renderPath(sq.x, sq.y, sq.val, sq.steps);
    });
  }

  function refresh(sq) {
    console.log('REFRESH', sq);
    currentPos = sq;
    initBoard();
    initPiece('N', sq);
    var pos = index[sq];
    var x = pos[0];
    var y = pos[1];
    renderPath(x, y, 1, 5);
    $("." + sq).find(".txt").addClass("hide").html("&nbsp;");
    console.log(tagged);
  }

  function toggleBlock(sq) {
    if (blocked[sq]) {
      blocked[sq] = false;
    } else {
      blocked[sq] = true;
    }
    console.log("BLOCKED", blocked);
    refresh(currentPos);
  }

  function clickHandler(event) {
    var target = $(event.currentTarget);
    var id = target.find(".identifier").text();
    if (event.which == 1) {
      refresh(id);
    } else {
      event.preventDefault();
      toggleBlock(id);
    }
  }

  refresh('g1');
});
