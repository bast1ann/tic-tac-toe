const gameboard = (function() {
  const board = [ ["", "", ""], ["", "", ""], ["", "", ""] ];

  function checkEmptyCell(row, col) {
    return (board[row][col] === "" ? true : false);
  }

  function checkFullBoard() {
    for (let row = 0; row < 3 ; row++) {
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

  return {checkEmptyCell, checkFullBoard, getBoard, resetBoard, writeBoard};
})();

const gameController = (function() {
  // initial state
  const playerOne = createPlayer("Computer 1", "X");
  const playerTwo = createPlayer("Computer 2", "O");
  let activePlayer = playerOne;
  let message = "";

  // functions
  function createPlayer(name, symbol) {
    let score = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const addScore = () => score++;
    const getScore = () => score;
    
    return {getName, getSymbol, getScore, addScore};
  }

  function getActivePlayer() {
    return activePlayer.getName();
  }

  function getMessage() {
    return message;
  }

  function switchPlayer() {
    activePlayer === playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
  }

  function checkWinner(board, symbol) {
    // check row winner
    for (let row = 0; row < 3; row++) {
      let counter = 0;
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === symbol) {
          counter+= 1;
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
          counter+= 1;
        }
      }
      if (counter == 3) {
        return true;
      }
    }
    // check diagonal winner
    if ( ((symbol === board[0][0])
    && (board[0][0] === board[1][1])
    && (board[1][1] === board[2][2]))
    || ((symbol === board[2][0])
    && (board[2][0] === board[1][1])
    && (board[1][1] === board[0][2])) ) {
      return true;
    }
  }

  function playRound(row, col) {
    // check if the cell is empty for the given play
    if (gameboard.checkEmptyCell(row, col)) {
      gameboard.writeBoard(row, col, activePlayer.getSymbol());
      // check winner or tie
      if (checkWinner(gameboard.getBoard(), activePlayer.getSymbol())) {
        activePlayer.addScore();
        gameboard.resetBoard();
        message = `${activePlayer.getName()} wins this round!`;
      }
      else if (gameboard.checkFullBoard()) {
        gameboard.resetBoard();
        message = `It's a tie!`;
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

  return {playRound,
          getActivePlayer,
          getMessage,
          playerOne : {getName : playerOne.getName, getScore : playerOne.getScore},
          playerTwo : {getName : playerTwo.getName, getScore : playerTwo.getScore}};
})();

const gameUI = (function() {
  const cell = document.querySelectorAll(".cell");
  const playerOneName = document.querySelector(".player-one-name");
  const playerTwoName = document.querySelector(".player-two-name");
  const playerOneScore = document.querySelector(".score-player-one");
  const playerTwoScore = document.querySelector(".score-player-two");
  const message = document.getElementById("message");

  playerOneName.textContent = gameController.playerOne.getName();
  playerTwoName.textContent = gameController.playerTwo.getName();

  cell.forEach( (el) => el.addEventListener("click", () => {
    const row = parseInt(el.dataset.row);
    const col = parseInt(el.dataset.col);
    gameController.playRound(row, col);
    updateScreen();
  }) );

  function updateScreen() {
    cell.forEach( (el) => {
      el.textContent = gameboard.getBoard()[el.dataset.row][el.dataset.col];
    } );
    playerOneScore.textContent = gameController.playerOne.getScore();
    playerTwoScore.textContent = gameController.playerTwo.getScore();
    message.textContent = gameController.getMessage();
  }

})();

