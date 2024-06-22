const gameboard = function() {
  const board = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];

  function displayBoard() {
    for (let i = 0; i < board.length; i++) {
      console.log(board[i]);
    }
  }

  function checkEmptyCell(row, col) {
    return (board[row][col] === 0 ? true : false);
  }

  function checkFullBoard() {
    for (let row = 0; row < 3 ; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === 0) {
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
      board[i].fill(0);
    }
  }

  return {displayBoard, checkEmptyCell, checkFullBoard, getBoard, resetBoard, writeBoard};
};

const gameController = (function() {
  // initial state
  const board = gameboard();
  const playerOne = createPlayer("Computer 1", 1);
  const playerTwo = createPlayer("Computer 2", 2);
  let activePlayer = playerOne;

  // functions
  function createPlayer(name, symbol) {
    let score = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const addScore = () => score++;
    const getScore = () => score;
    
    return {getName, getSymbol, getScore, addScore};
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
    if (board.checkEmptyCell(row, col)) {
      board.writeBoard(row, col, activePlayer.getSymbol());
      board.displayBoard();
      // check winner or tie
      if (checkWinner(board.getBoard(), activePlayer.getSymbol())) {
        activePlayer.addScore();
        board.resetBoard();
        console.log(`The winner is ${activePlayer.getName()}!`);
        console.log(`${playerOne.getName()} (${playerOne.getScore()}) - (${playerTwo.getScore()}) ${playerTwo.getName()}`);
        // show Modal Dialog and reset button
      }
      else if (board.checkFullBoard()) {
        console.log("It's a tie!");
        // show Modal Dialog and reset button
      }
      else {
        switchPlayer();
      }
    }
    else {
      console.log("Invalid move");
    }
  }

  return {playRound};
})();
