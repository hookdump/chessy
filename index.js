$(document).ready(function () {

    var walks = {
        'knight': function knightWalk(next, x, y, val, steps) {
            // knight!
            next.push(tagSquare(x + 1, y - 2, val, steps));
            next.push(tagSquare(x + 1, y + 2, val, steps));
            next.push(tagSquare(x - 1, y - 2, val, steps));
            next.push(tagSquare(x - 1, y + 2, val, steps));
            next.push(tagSquare(x + 2, y - 1, val, steps));
            next.push(tagSquare(x + 2, y + 1, val, steps));
            next.push(tagSquare(x - 2, y - 1, val, steps));
            next.push(tagSquare(x - 2, y + 1, val, steps));
            return next
        },
        'pawn': function pawnWalk(next, x, y, val, steps) {
            // pawn!
            next.push(tagSquare(x - 1, y - 1, val, steps));
            next.push(tagSquare(x - 1, y + 0, val, steps));
            next.push(tagSquare(x - 1, y + 1, val, steps));
            return next
        },
        'rook': function rookWalk(next, x, y, val, steps) {
            // pawn!
            next.push(tagSquare(x - 7, y + 0, val, steps));
            next.push(tagSquare(x + 0, y - 7, val, steps));
            next.push(tagSquare(x + 7, y + 0, val, steps));
            next.push(tagSquare(x + 0, y + 7, val, steps));
            return next
        },
        'king': function kingWalk(next, x, y, val, steps) {
            // king!
            next.push(tagSquare(x + 1, y + 1, val, steps));
            next.push(tagSquare(x + 1, y + 0, val, steps));
            next.push(tagSquare(x + 1, y - 1, val, steps));
            next.push(tagSquare(x + 0, y + 1, val, steps));
            // next.push(tagSquare(x + 0, y + 0, val, steps)); // can't stay here
            next.push(tagSquare(x + 0, y - 1, val, steps));
            next.push(tagSquare(x - 1, y + 1, val, steps));
            next.push(tagSquare(x - 1, y + 0, val, steps));
            next.push(tagSquare(x - 1, y - 1, val, steps));
            return next
        }
    };

    var board = [];
    var tagged = {};

    var index = {};
    var rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
    var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


    var initBoard = () => {
        board = [];
        tagged = {};
        $('.board').empty();

        var square = $("<div class='square'></div>");
        var addRow = (rowId) => {
            var row = $("<div class='row'></div>");
            board[rowId] = [];
            tagged[rowId] = [];

            for (var i = 0; i < 8; i++) {
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

        for (var i = 0; i < 8; i++) {
            addRow(i);
        }
        $(".square").on("click", clickHandler);
    };

    var initPiece = (type, square) => {
        // console.log(type, square);
        $("." + square).append(`<div class='piece ${type}'></div>`);
        $("." + square).find(".txt").html("&nbsp;");
    };

    var tagged = [];

    var tagSquare = (x, y, val, steps) => {
        var sq = null;
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            sq = board[x][y];
            if (!tagged[sq] || tagged[sq] > val) {
                var cur = $("." + sq).find(".txt").text();
                $("." + sq).find(".txt").text(val);
                $("." + sq).addClass("heat-" + val);
                tagged[sq] = val;
                if (steps > 0) {
                    return { x: x, y: y, val: ++val, steps: --steps };
                }
            }

        }
    }

    var renderPath = (walk, x, y, val, steps) => {
        var next = [];

        next = walk(next, x, y, val, steps)

        next.forEach((sq) => {
            if (sq && sq.x) renderPath(walk, sq.x, sq.y, sq.val, sq.steps);
        });
    }

    function refresh(sq, piecename) {
        // console.log('REFRESH', sq);
        initBoard();
        initPiece(piecename, sq);
        var pos = index[sq];
        var x = pos[0];
        var y = pos[1];
        renderPath(walks[piecename], x, y, 1, 7);
        $("." + sq).find(".txt").addClass("hide").html("&nbsp;");
    }

    function clickHandler(event) {
        var target = $(event.currentTarget);
        var square = target.find(".identifier").text();
        $('#square').val(square);
        var name = $('#piece').val();
        // console.log(name);
        refresh(square, name);
    }

    refresh('g1', 'knight');

    $('a').on('click', function (event) {
        var target = $(event.currentTarget);
        var name = target.attr('name');
        // console.log(name);
        $('#piece').val(name);
        refresh($('#square').val(), name)
    });

});
