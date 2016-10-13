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
var $boardSize = $("#board-size")

var playerOne, playerTwo;
var game;



var board = {
  rows: 0,
  columns: 0,
  display: [],
};

$board.on("click", $('.empty-circle'), function(e) {
  if(game.enabled) {
    playerChoice(e);
  }
});

$startBtn.on("click", function() {

  var start = new Date;
  var downFrom = 60;
  setInterval(function() {
      $('.timer').text(Math.floor((downFrom - new Date) / 1000) + " Seconds");
  }, 1000);
  $boardSize.attr("disabled", true)
  $startBtn.css("display", "none");
  playerOne.setColour($playerOneColourInput.value);
  playerTwo.setColour($playerTwoColourInput.value);
  game.enabled = true;
});

$nextBtn.on("click", function(){
  $nextBtn.css("display", "none");
  playerOne.setColour($playerOneColourInput.value);
  playerTwo.setColour($playerTwoColourInput.value);
  resetRound();
});

$resetBtn.on("click", function() {
  $board.empty();
  $result.css("display", "none");
  $startBtn.css("display", "inline");
  buildBoard(3, 3);
  renderBoard();
  init();
  renderScores();
});

$boardSize.on("change",function() {
  console.log($boardSize.val());
  var newSize = $boardSize.val();
  $board.empty();
  buildBoard(newSize, newSize)
  renderBoard();
})


function playerChoice(e) {
  var $clicked = $(e.target);

  if($clicked.attr("class") === "empty-circle") {
    if (game.playerTurn === 0) {
      $clicked.addClass("full-circle-one")
      $clicked.css("background-color", playerOne.getColour());
      board.display[$clicked.data().row][$clicked.data().col] = "X";
      game.playerTurn = 1;
     }
     else {
      $clicked.addClass("full-circle-two");
      $clicked.css("background-color", playerTwo.getColour())
      board.display[$clicked.data().row][$clicked.data().col] = "O";
      game.playerTurn = 0;
     }
     checkForWin();
     if (game.roundOver) {
       handleWin();
     }
     else if (game.noWin) {
       handleNoWin();
     }

    var gameWinner = getGameWinner();
    if (gameWinner) {
      handleGameOver(gameWinner);
    }
    // lastPlayerMove = $clicked.data();
    // computerChoice(e);
  }
}

function getGameWinner() {
  if (playerOne.getScore() === game.maxScore) {
    return playerOne;
  }
  else if (playerTwo.getScore() === game.maxScore) {
    return playerTwo;
  }
}

function handleGameOver(gameWinner) {
  debugger;
  $result.text("Game Over! " + gameWinner.getName() + " Wins!");
  $result.css("color", gameWinner.getColour());
  $nextBtn.css("display", "none");
  $resetBtn.css("display", "inline");
}

function checkForWin() {
  checkRows();
  if (!game.roundOver) {
    checkCols();
  }
  if (!game.roundOver) {
    checkFirstDiagonal();
  }
  if (!game.roundOver) {
    checkSecondDiagonal();
  }
  if (!game.roundOver) {
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
    game.noWin = true;
  }
}

function checkRows() {
  var playerOneTally;
  var playerTwoTally;

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
      game.roundOver = true;
      break;
    }
  }
}

function checkCols() {

  var playerOneTally;
  var playerTwoTally;

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
      game.roundOver = true;
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
      game.roundOver = true;
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
      game.roundOver = true;
      break;
    }

    n++;
  }
}


function haveWinner(playerOneTally, playerTwoTally) {
  if (playerOneTally === game.maxTally) {
    playerOne.setWonRound();
    game.roundOver = true;
    return true;
  }

  if (playerTwoTally === game.maxTally) {
    playerTwo.setWonRound();
    game.roundOver = true;
    return true;
  }
  return false;
}

function handleWin() {
  game.enabled = false;
  $result.css("display", "block");
  if (playerOne.hasWonRound())  {
    playerOne.incrementScore()
    $result.text("Round goes to Player 1!");
    $result.css("color", playerOne.getColour());
  }
  else {
    playerTwo.incrementScore();
    $result.text("Round goes to Player 2!");
    $result.css("color", playerTwo.getColour());
  }
  renderScores();
  $nextBtn.css("display", "inline");
}

function handleNoWin() {
  game.enabled = false;
  $result.css("display", "block");
  $result.text("No Winner!");
  $result.css("color", "white");
  $nextBtn.css("display", "inline");
}

function computerChoice(e) {
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
        bottomLeft = board.display[lastPlayerMove.row + 1][lastPlayerMove.col - 2];
      }
    }

    if (lastPlayerMove.col !== 0) {
      left = board.display[lastPlayerMove.row][lastPlayerMove.col - 1];
      if (lastPlayerMove.row !== 0) {
        topLeft = board.display[lastPlayerMove.row - 1][lastPlayerMove.col - 1];
      }
    }

    if (top && top !== "") {
      availableChoices.push();
    }

    // console.log("Top: " + top);
    // console.log("TopRight: " + topRight);
    // console.log("Right: " + right);
    // console.log("bottomRight: " + bottomRight);
    // console.log("bottom: " + bottom);
    // console.log("bottomLeft: " + bottomLeft);
    // console.log("left: " + left);
    // console.log("topLeft: " + topLeft);


}

function buildBoard(size) {
  board.display = [];
  // board.size = rows;
  // board.size = columns;
  board.size = size;

  for (var i = 0; i < size; i++) {
    var newRow = [];
    for (var j = 0; j < size; j++) {
      newRow.push("");
    }
    board.display.push(newRow);
  }
}

function renderBoard() {
  var width;
  var main = $("main");

  switch (+board.size) {
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

  // for (var i = 0; i < board.size; i++) {
  //   var $newRow = createRow();
  //   for (var j = 0; j < board.size; j++) {
  //     var $newCircle = createCircle();
  //     $newCircle.data("row", i);
  //     $newCircle.data("col", j);
  //     $newRow.append($newCircle);
  //   }
  //   $board.append($newRow);
  // }

  for (var i = 0; i < board.size; i++) {
    var $newCol = createCol();
    for (var j = 0; j < board.size; j++) {
      var $newCircle = createCircle();
      $newCircle.css({
        "height": width + "%"
      });
      $newCircle.data("row", j);
      $newCircle.data("col", i);
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
  $playerOneScoreDisplay.text(playerOne.getScore());
  $playerTwoScoreDisplay.text(playerTwo.getScore());
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

function resetRound() {
  game.enabled = true;
  game.noWin = false;
  game.playerTurn = 0;
  playerOne.resetRound();
  playerTwo.resetRound();
  game.roundOver = false;
  $board.empty();
  $result.css("display", "none");
  buildBoard(3, 3);
  renderBoard();
}

function init() {
  playerOne = Player();
  playerTwo = Player();
  game = {
    maxTally: board.size,
    roundOver: false,
    enabled: false,
    playerTurn: 0,
    noWin: false,
    maxScore: 5,
    winner: null
  }
  playerOne.setName("Player One");
  playerTwo.setName("Player Two");
  $resetBtn.css("display", "none");
  $nextBtn.css("display", "none");
}


buildBoard(3);
renderBoard();
init();
