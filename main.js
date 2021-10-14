const X = 'x';
const O = 'o';

/*
    TODO: Clean up the interface to allow players to put in their names and add
    a display element that congratulates the winning player!
 */

/*
    TODO: create an expert AI using minimax algorithm:
    https://en.wikipedia.org/wiki/Minimax
 */

const Player = (m, ai) => {
  const mark = m;
  const aiControlled = ai;

  // private methods

  const _getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const _chooseRandomCell = () => _getRandomIntInclusive(0, 8);

  // public methods

  const play = () => {
    let choice;
    do {
      choice = _chooseRandomCell();
    } while (gameBoard.isCellFilled(choice));
    game.playTurnAt(choice);
  };

  const getMark = () => mark;

  const isAi = () => aiControlled;

  return {
    play,
    getMark,
    isAi,
  };
};

const game = (() => {
  let playerOne = Player(X, false);
  let playerTwo = Player(O, false);
  let currentPlayer;
  let started = false;
  let over = false;

  // private methods

  const _switchPlayers = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  // TODO: make game over prettier

  const _gameOver = (player) => {
    over = true;
    if (!player) {
      alert("It's a tie!");
    } else {
      const winner = player === playerOne ? 'player 1' : 'player 2';
      alert(`${winner} wins`);
    }
  };

  // public methods

  const setPlayer = (mark, ai) => {
    if (mark === X) {
      playerOne = Player(mark, ai);
    } else {
      playerTwo = Player(mark, ai);
    }
  };

  const start = () => {
    started = true;
    currentPlayer = playerOne;
    if (currentPlayer.isAi()) currentPlayer.play();
  };

  const playTurnAt = (i) => {
    const mark = currentPlayer.getMark();
    gameBoard.setCell(mark, i);
    displayController.markCell(mark, i);
    if (gameBoard.checkForWin()) {
      _gameOver(currentPlayer);
    } else if (gameBoard.checkForTie()) {
      _gameOver();
    } else {
      _switchPlayers();
      if (currentPlayer.isAi()) currentPlayer.play();
    }
  };

  const restart = () => {
    started = false;
    over = false;
    currentPlayer = playerOne;
    gameBoard.clearBoard();
    displayController.clearBoard();
  };

  const hasStarted = () => started;

  const isOver = () => over;

  return {
    setPlayer,
    start,
    playTurnAt,
    restart,
    hasStarted,
    isOver,
  };
})();

const gameBoard = (() => {
  const emptyBoard = [null, null, null, null, null, null, null, null, null];
  let board = [...emptyBoard];

  // private methods

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

  // public methods

  const checkForWin = () =>
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
    checkForWin,
    checkForTie,
    clearBoard,
    setCell,
    isCellFilled,
  };
})();

const displayController = (() => {
  const playerSelectorsBlock = document.querySelector('.js-player-selectors');
  const btnTicHuman = document.querySelector('.js-btn-tic-human');
  const btnTicAi = document.querySelector('.js-btn-tic-ai');
  const btnTacHuman = document.querySelector('.js-btn-tac-human');
  const btnTacAi = document.querySelector('.js-btn-tac-ai');
  const cells = Array.from(document.querySelectorAll('.js-cell'));
  const btnControl = document.querySelector('.js-btn-control');

  // player selection buttons' methods

  btnTicHuman.onclick = () => {
    btnTicHuman.classList.add('pressed');
    btnTicAi.classList.remove('pressed');
    game.setPlayer(X, false);
  };

  btnTicAi.onclick = () => {
    btnTicAi.classList.add('pressed');
    btnTicHuman.classList.remove('pressed');
    game.setPlayer(X, true);
  };

  btnTacHuman.onclick = () => {
    btnTacHuman.classList.add('pressed');
    btnTacAi.classList.remove('pressed');
    game.setPlayer(O, false);
  };

  btnTacAi.onclick = () => {
    btnTacAi.classList.add('pressed');
    btnTacHuman.classList.remove('pressed');
    game.setPlayer(O, true);
  };

  // game field cells method

  cells.forEach((cell) =>
    cell.addEventListener('click', (e) => {
      const i = cells.indexOf(e.target);
      if (!game.hasStarted() || game.isOver() || gameBoard.isCellFilled(i))
        return;
      game.playTurnAt(i);
    })
  );

  // control button

  btnControl.onclick = () => {
    playerSelectorsBlock.classList.toggle('hidden');
    btnControl.classList.toggle('start');
    btnControl.classList.toggle('restart');
    if (game.hasStarted()) {
      game.restart();
    } else {
      game.start();
    }
  };

  // public methods

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
