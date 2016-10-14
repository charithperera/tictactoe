var $board = $(".board");
var $emptyCircle = $(".empty-circle");
var $playerOneScoreDisplay = $(".player-one-score");
var $playerTwoScoreDisplay = $(".player-two-score");
var $resetBtn = $(".reset-btn");
var $startBtn = $(".start-btn");
var $nextBtn = $(".next-btn");
var $playerOneColourInput = $(".player-one-colour")[0];
var $playerTwoColourInput = $(".player-two-colour")[0];
var $result = $(".resultDisplay");
var $boardSize = $("#board-size");
var $configBtn = $(".config-btn");
var $configPanel = $(".config");
var $closePanelBtn = $(".close-config");
var $playerOneName = $(".player-one-name");
var $playerTwoName = $(".player-two-name");
var $playerOneNameDisplay = $(".player-one-name-display");
var $playerTwoNameDisplay = $(".player-two-name-display");
var $maxScore = $(".max-score");
var $onePlayerBtn = $(".one-player-btn");
var $twoPlayerBtn = $(".two-player-btn");

var game;

$onePlayerBtn.on("click", function() {
  game.setType("single");
  hideModal();
})

$twoPlayerBtn.on("click", function() {
  game.setType("multi");
  hideModal();
})

$board.on("click", $('.empty-circle'), function(e) {
  if(game.isEnabled()) {
    playerChoice(e);
  }
});

$startBtn.on("click", function() {
  $closePanelBtn.click();
  $startBtn.css("display", "none");
  $configBtn.css("display", "none");
  $resetBtn.css("display", "block");
  game.playerOne().setColour($playerOneColourInput.value);
  game.playerTwo().setColour($playerTwoColourInput.value);
  game.playerOne().setName($playerOneName.val());
  game.playerTwo().setName($playerTwoName.val());
  game.setMaxScore(+$maxScore.val());
  game.enable();
});

$nextBtn.on("click", function(){
  $nextBtn.css("display", "none");
  game.playerOne().setColour($playerOneColourInput.value);
  game.playerTwo().setColour($playerTwoColourInput.value);
  resetRound();
});

$resetBtn.on("click", function() {
  $board.empty();
  $result.css("visibility", "hidden");
  $configBtn.css("display", "block");
  $startBtn.css("display", "block");
  game.buildBoard();
  init(+$boardSize.val());
  renderScores();
});

$boardSize.on("change",function() {
  var newSize = +$boardSize.val();
  $board.empty();
  game.buildBoard(newSize)
  renderBoard();
});

$configBtn.on("click", function() {
  $configPanel.animate({"left":"0px"}, "slow").addClass('visible');
});

$closePanelBtn.on("click", function() {
  $playerOneNameDisplay.text(game.playerOne().getName() || $playerOneName.val());
  $playerTwoNameDisplay.text(game.playerTwo().getName() || $playerTwoName.val());
  $configPanel.animate({"left":"-1000px"}, "slow").removeClass('visible');
})

function playerChoice(e) {
  var $clicked = $(e.target);
  if($clicked.attr("class") === "empty-circle") {
    if (game.type() === "single") {
        $clicked.addClass("full-circle-one")
        $clicked.css("background-color", game.playerOne().getColour());
        game.board().display[$clicked.data().row][$clicked.data().col] = "X";
        $(".empty-circle").css("border-color", game.playerTwo().getColour());
        $(".player-one").css("color", "white");
        $(".player-two").css("color", game.playerTwo().getColour());
        game.disable();
        $result.text("Thinkin....");
        $result.css("visibility", "visible");
        game.endTurn()
        if (!game.roundOver()) {
          setTimeout(function() {
            var choice = game.getComputerChoice(e);
            if (choice) {
              var $circle = $('[data-row="' + choice[0] + '"][data-col="' + choice[1] + '"');
              $circle.addClass("full-circle-two");
              $circle.css("background-color", game.playerTwo().getColour())
              game.board().display[choice[0]][choice[1]] = "O";
              $(".empty-circle").css("border-color", game.playerOne().getColour());
              $(".player-one").css("color", game.playerOne().getColour());
              $(".player-two").css("color", "white");
              game.enable();
              $result.css("visibility", "hidden");
              game.endTurn()
            }
          }, 2000)
        }
    }
    else {
      if (game.playerTurn() === 0) {
        $clicked.addClass("full-circle-one");
        $clicked.css("background-color", game.playerOne().getColour());
        game.board().display[$clicked.data().row][$clicked.data().col] = "X";
        $(".empty-circle").css("border-color", game.playerTwo().getColour());
        $(".player-one").css("color", "white");
        $(".player-two").css("color", game.playerTwo().getColour());
        game.setPlayerTurn(1);
        game.endTurn()
      }
      else {
       $clicked.addClass("full-circle-two");
       $clicked.css("background-color", game.playerTwo().getColour())
       game.board().display[$clicked.data().row][$clicked.data().col] = "O";
       $(".empty-circle").css("border-color", game.playerOne().getColour());
       $(".player-one").css("color", game.playerOne().getColour());
       $(".player-two").css("color", "white");
       game.setPlayerTurn(0);
       game.endTurn()
      }
    }
  }
}

function handleGameOver(gameWinner) {
  $result.text("Game Over! " + gameWinner.getName() + " Wins!");
  $result.css("color", gameWinner.getColour());
  $nextBtn.css("display", "none");
  $resetBtn.css("display", "block");
}

function handleWin() {
  game.disable();
  $result.css("visibility", "visible");

  if (game.playerOne().hasWonRound())  {
    game.playerOne().incrementScore()
    $result.text("Round goes to " + (game.playerOne().getName() || "Player One") + "!");
    $result.css("color", game.playerOne().getColour());
  }
  else {
    game.playerTwo().incrementScore();
    $result.text("Round goes to " + (game.playerTwo().getName() || "Player One") + "!");
    $result.css("color", game.playerTwo().getColour());
  }
  $(".empty-circle").css("border-color", "white");
  $(".player-one").css("color", "white");
  $(".player-two").css("color", "white");
  renderScores();
  $nextBtn.css("display", "block");
}

function handleNoWin() {
  game.disable();
  $result.css("visibility", "visible");
  $result.text("No Winner!");
  $result.css("color", "white");
  $nextBtn.css("display", "block");
  $(".empty-circle").css("border-color", "white");
  $(".player-one").css("color", "white");
  $(".player-two").css("color", "white");
}

function renderBoard() {
  var width;
  var main = $("main");

  switch (+game.board().size) {
    case 4:
      width = 25;
      break;
    case 5:
      width = 20;
      break;
    case 6:
      width = 17;
      break;
    case 7:
      width = 15;
      break;
    case 8:
      width = 13;
      break;
    case 9:
      width = 11;
      break;
    case 10:
      width = 10;
      break;
    default:
  }

  for (var i = 0; i < game.board().size; i++) {
    var $newCol = createCol();
    for (var j = 0; j < game.board().size; j++) {
      var $newCircle = createCircle();
      $newCircle.css({
        "height": width + "%"
      });
      $newCircle.attr("data-row", j);
      $newCircle.attr("data-col", i);
      $newCol.append($newCircle);
    }
    $board.append($newCol);
  }

  $board.css("display", "flex")
}

function createCircle() {
  var $newCircle = $("<div>");
  $newCircle.addClass("empty-circle");
  return $newCircle;
}

function createCol() {
  var $newCol = $("<div>");
  $newCol.addClass("col");
  return $newCol;
}

function renderScores() {
  $playerOneScoreDisplay.text(game.playerOne().getScore());
  $playerTwoScoreDisplay.text(game.playerTwo().getScore());
}

function resetRound() {
  game.reset();
  $board.empty();
  $result.css("visibility", "hidden");
  game.buildBoard(+$boardSize.val());
  renderBoard();
}

function init(size) {
  showModal();
  game = Game(size);
  game.buildBoard(size);
  renderBoard()
  $playerOneNameDisplay.text(game.playerOne().getName() || $playerOneName.val());
  $playerTwoNameDisplay.text(game.playerTwo().getName() || $playerTwoName.val());
  $resetBtn.css("display", "none");
  $nextBtn.css("display", "none");
}

function showModal() {
  var overlay = document.getElementById("overlay");
  overlay.style.visibility = "visible";
}

function hideModal() {
  var overlay = document.getElementById("overlay");
  overlay.style.visibility = "hidden"
}

function Player() {
  var score = 0;
  var wonRound = false;
  var colour;
  var name;

  return {
    getScore: function() {
      return score;
    },
    incrementScore: function() {
      score++;
    },
    hasWonRound: function() {
      return wonRound;
    },
    setWonRound: function() {
      wonRound = true;
    },
    resetRound: function() {
      wonRound = false;
    },
    setColour: function(newColour) {
      colour = newColour;
    },
    getColour: function() {
      return colour;
    },
    setName: function(newName) {
      name = newName;
    },
    getName: function() {
      return name;
    }

  }
}

function Game(size) {
  var maxTally = size;
  var roundOver = false;
  var enabled = false;
  var playerTurn = 0;
  var noWin = false;
  var maxScore = +$maxScore.val();
  var winner = null;
  var type = "single";
  var playerOne = Player();
  var playerTwo = Player();
  var board = {
      size: 3,
      display: [],
    }

  function checkForWin() {
    checkRows();
    if (!roundOver) {
      checkCols();
    }
    if (!roundOver) {
      checkFirstDiagonal();
    }
    if (!roundOver) {
      checkSecondDiagonal();
    }
    if (!roundOver) {
      checkForNoResult();
    }
  }

  function checkForNoResult() {
    var maxSpots = board.size * board.size;
    var countedSpots = 0;

    for (var i = 0; i < board.size; i++) {
      for (var j = 0; j < board.size; j++) {
        if (board.display[i][j] !== "") {
          countedSpots++;
        }
      }
    }

    if (countedSpots === maxSpots) {
      noWin = true;
    }
  }

  function checkRows() {
    var playerOneTally = 0;
    var playerTwoTally = 0;

    for (var i = 0; i < board.size; i++) {
      playerOneTally = 0;
      playerTwoTally = 0;
      for (var j = 0; j < board.size; j++) {
        if (board.display[i][j] === "X") {
          playerOneTally++;
        }
        else if (board.display[i][j] === "O") {
          playerTwoTally++;
        }
      }

      if (haveWinner(playerOneTally, playerTwoTally)) {
        roundOver = true;
        break;
      }
    }
  }

  function checkCols() {
    var playerOneTally = 0;
    var playerTwoTally = 0;
    var transposedBoard = board.display[0].map(function(col, i) {
      return board.display.map(function(row) {
        return row[i]
      })
    });
    for (var i = 0; i < board.size; i++) {
      playerOneTally = 0;
      playerTwoTally = 0;

      for (var j = 0; j < board.size; j++) {
        if (transposedBoard[i][j] === "X") {
          playerOneTally++;
        }
        else if (transposedBoard[i][j] === "O") {
          playerTwoTally++;
        }
      }
      if (haveWinner(playerOneTally, playerTwoTally)) {
        roundOver = true;
        break;
      }
    }
  }

  function checkFirstDiagonal() {
    var playerOneTally = 0;
    var playerTwoTally = 0;

    for (var i = 0; i < board.size; i++) {
      if (board.display[i][i] === "X") {
        playerOneTally++;
      }
      else if (board.display[i][i] === "O") {
        playerTwoTally++;
      }

      if (haveWinner(playerOneTally, playerTwoTally)) {
        roundOver = true;
        break;
      }
    }
  }

  function checkSecondDiagonal() {
    var n = 0;
    var playerOneTally = 0;
    var playerTwoTally = 0;
    for (var i = board.size - 1; i >= 0; i--) {
      if (board.display[i][n] === "X") {
        playerOneTally++;
      }
      else if (board.display[i][n] === "O") {
        playerTwoTally++;
      }

      if (haveWinner(playerOneTally, playerTwoTally)) {
        roundOver = true;
        break;
      }
      n++;
    }
  }

  function haveWinner(playerOneTally, playerTwoTally) {
    if (playerOneTally === board.size) {
      playerOne.setWonRound();
      roundOver = true;
      return true;
    }
    if (playerTwoTally === board.size) {
      playerTwo.setWonRound();
      roundOver = true;
      return true;
    }
    return false;
  }

  function getGameWinner() {
    if (playerOne.getScore() === maxScore) {
      return playerOne;
    }
    else if (playerTwo.getScore() === maxScore) {
      return playerTwo;
    }
  }

  return {
    buildBoard: function(size=3) {
      board.display = [];
      board.size = size;
      for (var i = 0; i < size; i++) {
        var newRow = [];
        for (var j = 0; j < size; j++) {
          newRow.push("");
        }
        board.display.push(newRow);
      }
    },
    playerOne: function() {
      return playerOne;
    },
    playerTwo: function() {
      return playerTwo;
    },
    board: function() {
      return board;
    },
    setMaxScore: function(newMaxScore) {
      maxScore = newMaxScore;
    },
    enable: function() {
      enabled = true;
    },
    disable: function() {
      enabled = false;
    },
    isEnabled: function() {
      return enabled;
    },
    setType: function(newType) {
      type = newType;
    },
    type: function() {
      return type;
    },
    roundOver: function() {
      return roundOver;
    },
    playerTurn: function() {
      return playerTurn;
    },
    setPlayerTurn: function(newTurn) {
      playerTurn = newTurn;
    },
    endTurn: function() {
      checkForWin();
      if (roundOver) {
        handleWin();
      }
      else if (noWin) {
        handleNoWin();
      }

     var gameWinner = getGameWinner();
     if (gameWinner) {
       handleGameOver(gameWinner);
     }
   },
   reset: function() {
     enabled = true;
     noWin = false;
     playerTurn = 0;
     playerOne.resetRound();
     playerTwo.resetRound();
     roundOver = false;
   },
  getComputerChoice: function(e) {
       var availableChoices = [];
       var lastPlayerMove = $(e.target).data();
       var top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft;

       if (lastPlayerMove.row !== 0) {
         top = board.display[lastPlayerMove.row - 1][lastPlayerMove.col];
         if (lastPlayerMove.col !== board.cols - 1) {
           topRight = board.display[lastPlayerMove.row - 1][lastPlayerMove.col + 1];
         }
       }

       if (lastPlayerMove.col !== board.cols - 1) {
         right = board.display[lastPlayerMove.row][lastPlayerMove.col + 1];
         if (lastPlayerMove.row !== board.size - 1) {
           bottomRight = board.display[lastPlayerMove.row + 1][lastPlayerMove.col + 1];
         }
       }

       if (lastPlayerMove.row !== board.size - 1) {
         bottom = board.display[lastPlayerMove.row + 1][lastPlayerMove.col];
         if (lastPlayerMove.col !== 0) {
           bottomLeft = board.display[lastPlayerMove.row + 1][lastPlayerMove.col - 1];
         }
       }

       if (lastPlayerMove.col !== 0) {
         left = board.display[lastPlayerMove.row][lastPlayerMove.col - 1];
         if (lastPlayerMove.row !== 0) {
           topLeft = board.display[lastPlayerMove.row - 1][lastPlayerMove.col - 1];
         }
       }

       if (top === "") {
         availableChoices.push([lastPlayerMove.row - 1, lastPlayerMove.col]);
       }
       if (topRight === "") {
         availableChoices.push([lastPlayerMove.row - 1, lastPlayerMove.col + 1]);
       }
       if (right === "") {
         availableChoices.push([lastPlayerMove.row, lastPlayerMove.col + 1]);
       }
       if (bottomRight === "") {
         availableChoices.push([lastPlayerMove.row + 1, lastPlayerMove.col + 1]);
       }
       if (bottom === "") {
         availableChoices.push([lastPlayerMove.row + 1, lastPlayerMove.col]);
       }
       if (bottomLeft === "") {
         availableChoices.push([lastPlayerMove.row + 1, lastPlayerMove.col - 1]);
       }
       if (left === "") {
         availableChoices.push([lastPlayerMove.row, lastPlayerMove.col - 1]);
       }
       if (topLeft === "") {
         availableChoices.push([lastPlayerMove.row - 1, lastPlayerMove.col - 1]);
       }

       if (availableChoices.length === 0) {
         for (var i = 0; i < board.size; i++) {
           for (var j = 0; j < board.size; j++) {
             if (board.display[i][j] === "") {
               availableChoices.push([i,j]);
             }
           }
         }
       }

       // console.log("Top: " + top);
       // console.log("TopRight: " + topRight);
       // console.log("Right: " + right);
       // console.log("bottomRighat: " + bottomRight);
       // console.log("bottom: " + bottom);
       // console.log("bottomLeft: " + bottomLeft);
       // console.log("left: " + left);
       // console.log("topLeft: " + topLeft);
       // console.log(availableChoices);

       var randomChoice = Math.floor(Math.random() * (availableChoices.length));
       return availableChoices[randomChoice];
   }
  }

}

init();
