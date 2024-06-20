const board = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];

function createPlayer(name, symbol, isCurrentPlayer) {
  return {name, symbol, isCurrentPlayer};
}

function displayBoard() {
  for (let i = 0; i < board.length; i++) {
    console.log(board[i]);
  }
}

function checkEmptyCell(r, c) {
  return (board[r][c] === 0 ? true : false);
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

function checkWinner(player) {
  // check row winner
  for (let row = 0; row < 3; row++) {
    let counter = 0;
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === player.symbol) {
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
      if (board[row][col] === player.symbol) {
        counter+= 1;
      }
    }
    if (counter == 3) {
      return true;
    }
  }

  // check diagonal winner
  if ( ((player.symbol === board[0][0])
        && (board[0][0] === board[1][1])
        && (board[1][1] === board[2][2]))
      || ((player.symbol === board[2][0])
            && (board[2][0] === board[1][1])
            && (board[1][1] === board[0][2])) ) {
    return true;
  }
}

function playMove(r, c, player) {
  board[r][c] = player.symbol;
}

function playRound() {
  let currentPlayer;

  if (playerOne.isCurrentPlayer === true) {
    currentPlayer = playerOne;
  }
  else {
    currentPlayer = playerTwo;
  }

  let isEmpty;
  let moveRow;
  let moveCol;

  do {
    moveRow = prompt("Row:");
    moveCol = prompt("Col:");
    isEmpty = checkEmptyCell(moveRow, moveCol);
  } while (isEmpty === false);

  playMove(moveRow, moveCol, currentPlayer)
  displayBoard();

  playerOne.isCurrentPlayer = !playerOne.isCurrentPlayer;
  playerTwo.isCurrentPlayer = !playerTwo.isCurrentPlayer;

  if (checkWinner(playerOne)) {
    console.log("Player one is the winner");
  }
  else if (checkWinner(playerTwo)) {
    console.log("Player two is the winner");
  }
  else if (checkFullBoard()) {
    console.log("It's a tie");
  }
}

const playerOne = createPlayer(prompt("Player 1:"), 1, true);
const playerTwo = createPlayer(prompt("Player 2:"), 2, false);
displayBoard();