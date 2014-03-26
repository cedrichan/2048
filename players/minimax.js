(function (g) {
  var directions = [0,1,2,3];
  var maxLookahead = 1;

  function copyGame(original) {
    var game = new GameManager(g.game.size, MockKeyboardInputManager, MockHTMLActuator, MockLocalStorageManager);
    game.restoreState(original.serialize());
    return game;
  }

  function playTurn() {
    if(g.game.over) {
      return;
    }
    if(g.game.won) {
      g.game.keepPlaying();
    }

    setTimeout(function () {
      var direction = minimax(g.game, 2).direction;
      g.game.move(direction);
      playTurn();
    }, 30);
  }

  function minimax(game, lookahead) {
    var maxMove;
    var move;
    for(var direction=0; direction < directions.length; direction++) {
      move = new MyMove(copyGame(game), direction, lookahead);
      move.evaluate();

      if(maxMove) {
        if(maxMove.value < move.value) {
          maxMove = move;
        }
      } else {
        maxMove = move;
      }
    }

    return maxMove;
  }

  function MyMove(game, direction, lookahead) {
    this.game = game;
    this.direction = direction;
    this.lookahead = lookahead;
  }
  MyMove.prototype.evaluate = function() {
    if(this.game.over) {
      this.value = this.game.score;
      return;
    }

    var moved = this.game.moveOnly(this.direction);

    if(!moved) {
      this.value = Number.NEGATIVE_INFINITY;
      return;
    }
    if(this.lookahead === 0) {
      this.value = this.game.score;
      return;
    }

    var cells = this.game.grid.availableCells();
    var cell;
    var game;
    var nextMove;
    var bestMove;
    for(var i=0; i < cells.length; i++) {
      cell = cells[i];
      game = copyGame(this.game);
      game.addTile(cell, 2);
      for(var direction=0; direction < directions.length; direction++) {
        nextMove = new MyMove(game, direction, this.lookahead - 1);
        nextMove.evaluate();

        if(bestMove) {
          if(bestMove.value < nextMove.value) {
            bestMove = nextMove;
          }
        } else {
          bestMove = nextMove;
        }
      }
    }

    this.value = bestMove.value;
  }

  g.playTurn = playTurn;
}(window));
