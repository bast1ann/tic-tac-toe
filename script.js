const gameboard = function () {
  const board = [["", "", ""], ["", "", ""], ["", "", ""]];

  function checkEmptyCell(row, col) {
    return (board[row][col] === "" ? true : false);
  }

  function checkFullBoard() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "") {
          return false;
        }
      }
    }
    return true;
  }

  function writeBoard(row, col, symbol) {
    board[row][col] = symbol;
  }

  function getBoard() {
    return board;
  }

  function resetBoard() {
    for (let i = 0; i < 3; i++) {
      board[i].fill("");
    }
  }

  return { checkEmptyCell, checkFullBoard, getBoard, resetBoard, writeBoard };
};

function createPlayer(name, symbol) {
  let score = 0;
  const getName = () => name;
  const getSymbol = () => symbol;
  const addScore = () => score++;
  const getScore = () => score;
  const changeName = (newName) => name = newName;
  const resetScore = function() {
    score = 0;
  };

  return { getName, getSymbol, getScore, addScore, changeName, resetScore };
};

const gameController = function () {
  // initial stat
  const board = gameboard();
  const playerOne = createPlayer("Player 1", "✗");
  const playerTwo = createPlayer("Player 2", "❍");
  let activePlayer = playerOne;
  let firstTurn = playerOne;
  let message = `It's ${activePlayer.getName()}'s turn.`;
  let boardActive = true;

  // functions
  function getActivePlayer() {
    return activePlayer.getName();
  }

  function getMessage() {
    return message;
  }

  function switchPlayer() {
    activePlayer === playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
  }

  function switchFirstTurn() {
    firstTurn === playerOne ? firstTurn = playerTwo : firstTurn = playerOne;
  };

  function checkWinner(board, symbol) {
    // check row winner
    for (let row = 0; row < 3; row++) {
      let counter = 0;
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === symbol) {
          counter += 1;
        }
      }
      if (counter == 3) {
        return true;
      }
    }
    // check column winner
    for (let col = 0; col < 3; col++) {
      let counter = 0;
      for (let row = 0; row < 3; row++) {
        if (board[row][col] === symbol) {
          counter += 1;
        }
      }
      if (counter == 3) {
        return true;
      }
    }
    // check diagonal winner
    if (((symbol === board[0][0])
      && (board[0][0] === board[1][1])
      && (board[1][1] === board[2][2]))
      || ((symbol === board[2][0])
        && (board[2][0] === board[1][1])
        && (board[1][1] === board[0][2]))) {
      return true;
    }
  }

  function playRound(row, col) {
    if (!boardActive) {
      boardActive = true;
      board.resetBoard();
      message = `It's ${activePlayer.getName()} turn.`;
      return;
    }
    // check if the cell is empty for the given play
    if (board.checkEmptyCell(row, col)) {
      board.writeBoard(row, col, activePlayer.getSymbol());
      // check winner or tie
      if (checkWinner(board.getBoard(), activePlayer.getSymbol())) {
        activePlayer.addScore();
        boardActive = false;
        message = `${activePlayer.getName()} wins this round!`;
        switchFirstTurn();
        activePlayer = firstTurn;
      }
      else if (board.checkFullBoard()) {
        boardActive = false;
        message = `It's a tie!`;
        switchFirstTurn();
        activePlayer = firstTurn;
      }
      else {
        switchPlayer();
        message = `It's ${activePlayer.getName()} turn.`;
      }
    }
    else {
      message = `This is an invalid move! Play again ${activePlayer.getName()}.`;
    }
  }

  return {
    playRound,
    getActivePlayer,
    getMessage,
    getBoard: board.getBoard,
    resetBoard: board.resetBoard,
    playerOne: { getName: playerOne.getName, getScore: playerOne.getScore, changeName: playerOne.changeName, resetScore: playerOne.resetScore },
    playerTwo: { getName: playerTwo.getName, getScore: playerTwo.getScore, changeName: playerTwo.changeName, resetScore: playerTwo.resetScore }
  };
};

const gameUI = (function () {
  const game = gameController();

  const cell = document.querySelectorAll(".cell");
  const playerOneName = document.querySelector(".player-one-name");
  const playerTwoName = document.querySelector(".player-two-name");
  const playerOneScore = document.querySelector(".score-player-one");
  const playerTwoScore = document.querySelector(".score-player-two");
  const message = document.getElementById("message");
  const configMenu = document.getElementById("config-menu");
  const startButton = document.getElementById("submit");
  const configButton = document.getElementById("config-button");
  const resetButton = document.getElementById("reset-button");

  configMenu.showModal();

  cell.forEach((el) => el.addEventListener("click", () => {
    const row = parseInt(el.dataset.row);
    const col = parseInt(el.dataset.col);
    game.playRound(row, col);
    updateScreen();
  }));

  startButton.addEventListener("click", (event) => {
    event.preventDefault();

    const form = document.querySelector("#config-menu form");
    const newNameOne = document.getElementById("player-one");
    const newNameTwo = document.getElementById("player-two");

    if (form.reportValidity()) {
      game.playerOne.changeName(newNameOne.value);
      game.playerTwo.changeName(newNameTwo.value);
      playerOneName.textContent = game.playerOne.getName();
      playerTwoName.textContent = game.playerTwo.getName();
      message.textContent = `It's ${game.getActivePlayer()}'s turn.`;

      configMenu.close();
    }
  });

  configButton.addEventListener("click", () => {
    configMenu.showModal();
  });

  resetButton.addEventListener("click", () => {
    game.playerOne.resetScore();
    game.playerTwo.resetScore();
    game.resetBoard();
    updateScreen();
    console.log("hi");
  });

  function updateScreen() {
    cell.forEach((el) => {
      el.textContent = game.getBoard()[el.dataset.row][el.dataset.col];
    });
    playerOneScore.textContent = game.playerOne.getScore();
    playerTwoScore.textContent = game.playerTwo.getScore();
    message.textContent = game.getMessage();
  }

})();

