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

var playerOne, playerTwo, game, board;

$board.on("click", $('.empty-circle'), function(e) {
  if(game.enabled) {
    playerChoice(e);
  }
});


$startBtn.on("click", function() {
  $closePanelBtn.click();
  $startBtn.css("display", "none");
  $configBtn.css("display", "none");
  $resetBtn.css("display", "block");
  playerOne.setColour($playerOneColourInput.value);
  playerTwo.setColour($playerTwoColourInput.value);
  playerOne.setName($playerOneName.val());
  playerTwo.setName($playerTwoName.val());
  game.maxScore = +$maxScore.val();
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
  $result.css("visibility", "hidden");
  $configBtn.css("display", "block");
  $startBtn.css("display", "block");
  buildBoard(board.size);
  renderBoard();
  init();
  renderScores();
});

$boardSize.on("change",function() {
  var newSize = +$boardSize.val();
  $board.empty();
  buildBoard(newSize)
  renderBoard();
});

$configBtn.on("click", function() {
  $configPanel.animate({"left":"0px"}, "slow").addClass('visible');
});

$closePanelBtn.on("click", function() {
  $playerOneNameDisplay.text(playerOne.getName() || $playerOneName.val());
  $playerTwoNameDisplay.text(playerTwo.getName() || $playerTwoName.val());
  $configPanel.animate({"left":"-1000px"}, "slow").removeClass('visible');
})

$onePlayerBtn.on("click", function() {
  game.type = "single";
  hideModal();
})

$twoPlayerBtn.on("click", function() {
  game.type = "multi";
  hideModal();
})

function playerChoice(e) {
  var $clicked = $(e.target);
  if($clicked.attr("class") === "empty-circle") {
    if (game.type === "single") {
        $clicked.addClass("full-circle-one")
        $clicked.css("background-color", playerOne.getColour());
        board.display[$clicked.data().row][$clicked.data().col] = "X";
        $(".empty-circle").css("border-color", playerTwo.getColour());
        $(".player-one").css("color", "white");
        $(".player-two").css("color", playerTwo.getColour());
        game.enabled = false;
        $result.text("Thinkin....");
        $result.css("visibility", "visible");
        endTurn()
        if (!game.roundOver) {
          setTimeout(function() {
            var choice = getComputerChoice(e);
            if (choice) {
              var circle = $('[data-row="' + choice[0] + '"][data-col="' + choice[1] + '"');
              circle.addClass("full-circle-two");
              board.display[choice[0]][choice[1]] = "O";
              $(".empty-circle").css("border-color", playerOne.getColour());
              $(".player-one").css("color", playerOne.getColour());
              $(".player-two").css("color", "white");
              game.enabled = true;
              $result.css("visibility", "hidden");
              endTurn()
            }
          }, 3000)
        }
    }
    else {
      if (game.playerTurn === 0) {
        $clicked.addClass("full-circle-one");
        $clicked.css("background-color", playerOne.getColour());
        board.display[$clicked.data().row][$clicked.data().col] = "X";
        $(".empty-circle").css("border-color", playerTwo.getColour());
        $(".player-one").css("color", "white");
        $(".player-two").css("color", playerTwo.getColour());
        game.playerTurn = 1;
        endTurn()
      }
      else {
       $clicked.addClass("full-circle-two");
       $clicked.css("background-color", playerTwo.getColour())
       board.display[$clicked.data().row][$clicked.data().col] = "O";
       $(".empty-circle").css("border-color", playerOne.getColour());
       $(".player-one").css("color", playerOne.getColour());
       $(".player-two").css("color", "white");
       game.playerTurn = 0;
       endTurn()
      }
    }
  }
}

function endTurn() {
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
  $result.text("Game Over! " + gameWinner.getName() + " Wins!");
  $result.css("color", gameWinner.getColour());
  $nextBtn.css("display", "none");
  $resetBtn.css("display", "block");
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
      game.roundOver = true;
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
  if (playerOneTally === board.size) {
    playerOne.setWonRound();
    game.roundOver = true;
    return true;
  }
  if (playerTwoTally === board.size) {
    playerTwo.setWonRound();
    game.roundOver = true;
    return true;
  }
  return false;
}

function handleWin() {
  game.enabled = false;
  $result.css("visibility", "visible");

  if (playerOne.hasWonRound())  {
    playerOne.incrementScore()
    $result.text("Round goes to " + (playerOne.getName() || "Player One") + "!");
    $result.css("color", playerOne.getColour());
  }
  else {
    playerTwo.incrementScore();
    $result.text("Round goes to " + (playerTwo.getName() || "Player One") + "!");
    $result.css("color", playerTwo.getColour());
  }
  $(".empty-circle").css("border-color", "white");
  $(".player-one").css("color", "white");
  $(".player-two").css("color", "white");
  renderScores();
  $nextBtn.css("display", "block");
}

function handleNoWin() {
  game.enabled = false;
  $result.css("visibility", "visible");
  $result.text("No Winner!");
  $result.css("color", "white");
  $nextBtn.css("display", "block");
  $(".empty-circle").css("border-color", "white");
  $(".player-one").css("color", "white");
  $(".player-two").css("color", "white");
}

function getComputerChoice(e) {
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

function buildBoard(size) {
  board = {
    rows: 0,
    columns: 0,
    display: [],
  }
  board.display = [];
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

  for (var i = 0; i < board.size; i++) {
    var $newCol = createCol();
    for (var j = 0; j < board.size; j++) {
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
  $result.css("visibility", "hidden");
  buildBoard(board.size);
  renderBoard();
}

function init() {
  showModal();
  playerOne = Player();
  playerTwo = Player();

  game = {
    maxTally: board.size,
    roundOver: false,
    enabled: false,
    playerTurn: 0,
    noWin: false,
    maxScore: +$maxScore.val(),
    winner: null,
    type: "single"
  }
  $playerOneNameDisplay.text(playerOne.getName() || $playerOneName.val());
  $playerTwoNameDisplay.text(playerTwo.getName() || $playerTwoName.val());
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


buildBoard(3);
renderBoard();
init();
