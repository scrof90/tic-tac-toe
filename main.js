const X = 'x';
const O = 'o';

const Player = (m) => {
  const mark = m;

  const getMark = () => mark;

  return {
    getMark,
  };
};

/*
    TODO: Clean up the interface to allow players to put in their names and add
    a display element that congratulates the winning player!
 */

/*
    TODO: create an AI for solo play
 */

const game = (() => {
  let playerOne = Player(X);
  let playerTwo = Player(O);
  let currentPlayer = playerOne;
  let gameOver = false;

  const _switchPlayers = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const _end = (player) => {
    if (!player) {
      alert("It's a tie!");
    } else {
      const winner = player === playerOne ? 'player 1' : 'player 2';
      alert(`${winner} wins`);
    }
    gameOver = true;
  };

  const playTurnAt = (i) => {
    const mark = currentPlayer.getMark();
    gameBoard.setCell(mark, i);
    displayController.markCell(mark, i);
    if (gameBoard.checkForWinCondition()) {
      _end(currentPlayer);
    } else if (gameBoard.checkForTie()) {
      _end();
    } else {
      _switchPlayers();
    }
  };

  const restart = () => {
    gameOver = false;
    currentPlayer = playerOne;
    gameBoard.clearBoard();
    displayController.clearBoard();
  };

  const isOver = () => gameOver;

  return {
    playTurnAt,
    restart,
    isOver,
  };
})();

const gameBoard = (() => {
  const emptyBoard = [null, null, null, null, null, null, null, null, null];
  let board = [...emptyBoard];

  const _checkRows = () => {
    for (let i = 0; i <= 2; i++) {
      const rowStart = i * 3;
      const rowEnd = rowStart + 3;
      const row = board.slice(rowStart, rowEnd);
      const mark = row[0];
      if (mark) return row.every((cell) => cell === mark);
    }
  };

  const _checkCols = () => {
    for (let i = 0; i <= 2; i++) {
      const colMiddle = i + 3;
      const colEnd = colMiddle + 3;
      const col = [board[i], board[colMiddle], board[colEnd]];
      const mark = col[0];
      if (mark) return col.every((cell) => cell === mark);
    }
  };

  const _checkLeftDiag = () => {
    const diag = [board[0], board[4], board[board.length - 1]];
    const mark = diag[0];
    if (mark) return diag.every((cell) => cell === mark);
  };
  const _checkRightDiag = () => {
    const diag = [board[2], board[4], board[6]];
    const mark = diag[0];
    if (mark) return diag.every((cell) => cell === mark);
  };

  const checkForWinCondition = () =>
    _checkRows() || _checkCols() || _checkLeftDiag() || _checkRightDiag();

  const checkForTie = () => board.every((cell) => cell);

  const clearBoard = () => {
    board = [...emptyBoard];
  };

  const setCell = (mark, i) => {
    board[i] = mark;
  };

  const isCellFilled = (i) => !!board[i];

  return {
    checkForWinCondition,
    checkForTie,
    clearBoard,
    setCell,
    isCellFilled,
  };
})();

const displayController = (() => {
  const cells = Array.from(document.querySelectorAll('.js-cell'));
  cells.forEach((cell) =>
    cell.addEventListener('click', (e) => {
      const i = cells.indexOf(e.target);
      if (game.isOver() || gameBoard.isCellFilled(i)) return;
      game.playTurnAt(i);
    })
  );

  const btnRestart = document.querySelector('.js-btn-restart');
  btnRestart.onclick = game.restart;

  const clearBoard = () => {
    cells.forEach((cell) => {
      cell.classList.remove('tic', 'tac');
    });
  };
  const markCell = (mark, i) => {
    cells[i].classList.add(mark === X ? 'tic' : 'tac');
  };

  return {
    clearBoard,
    markCell,
  };
})();
