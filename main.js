const X = 'x';
const O = 'o';

/*
    TODO: Clean up the interface to allow players to put in their names
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

  const getMark = () => mark;

  const isAi = () => aiControlled;

  const play = () => {
    let choice;
    do {
      choice = _chooseRandomCell();
    } while (gameBoard.isCellFilled(choice));
    game.playTurnAt(choice);
  };

  return {
    getMark,
    isAi,
    play,
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

  const _gameOver = (player) => {
    over = true;
    let result;
    if (!player) {
      result = "It's a tie!";
    } else {
      const winner = player === playerOne ? 'X' : 'O';
      result = `${winner} wins!`;
    }
    displayController.showResult(result);
  };

  // public methods

  const hasStarted = () => started;

  const isOver = () => over;

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
    gameBoard.resetBoard();
    displayController.resetBoard();
  };

  return {
    hasStarted,
    isOver,
    setPlayer,
    start,
    playTurnAt,
    restart,
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
      if (mark && row.every((cell) => cell === mark)) return true;
    }
    return false;
  };

  const _checkCols = () => {
    for (let i = 0; i <= 2; i++) {
      const colStart = i;
      const colMid = colStart + 3;
      const colEnd = colMid + 3;
      const col = [board[colStart], board[colMid], board[colEnd]];
      const mark = col[0];
      if (mark && col.every((cell) => cell === mark)) return true;
    }
    return false;
  };

  const _checkLeftDiag = () => {
    const diag = [board[0], board[4], board[board.length - 1]];
    const mark = diag[0];
    return mark && diag.every((cell) => cell === mark);
  };

  const _checkRightDiag = () => {
    const diag = [board[2], board[4], board[6]];
    const mark = diag[0];
    return mark && diag.every((cell) => cell === mark);
  };

  // public methods

  const isCellFilled = (i) => !!board[i];

  const setCell = (mark, i) => {
    board[i] = mark;
  };

  const checkForWin = () =>
    _checkRows() || _checkCols() || _checkLeftDiag() || _checkRightDiag();

  const checkForTie = () => board.every((cell) => cell);

  const resetBoard = () => {
    board = [...emptyBoard];
  };

  return {
    isCellFilled,
    setCell,
    checkForWin,
    checkForTie,
    resetBoard,
  };
})();

const displayController = (() => {
  const playerSelectors = document.querySelector('.js-player-selectors');
  const btnTicHuman = document.querySelector('.js-btn-tic-human');
  const btnTicAi = document.querySelector('.js-btn-tic-ai');
  const btnTacHuman = document.querySelector('.js-btn-tac-human');
  const btnTacAi = document.querySelector('.js-btn-tac-ai');
  const cells = Array.from(document.querySelectorAll('.js-cell'));
  const infoDisplay = document.querySelector('.js-info-display');
  const btnControl = document.querySelector('.js-btn-control');

  // private methods

  const _toggleCssClasses = (el, ...cls) =>
    cls.map((cl) => el.classList.toggle(cl));

  // Event handlers:

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

  cells.forEach((cell) =>
    cell.addEventListener('click', (e) => {
      const i = cells.indexOf(e.target);
      if (!game.hasStarted() || game.isOver() || gameBoard.isCellFilled(i))
        return;
      game.playTurnAt(i);
    })
  );

  btnControl.onclick = () => {
    _toggleCssClasses(playerSelectors, 'hidden');
    _toggleCssClasses(btnControl, 'start', 'restart');
    if (game.hasStarted()) {
      game.restart();
    } else {
      game.start();
    }
  };

  // public methods

  const markCell = (mark, i) => {
    cells[i].classList.add(mark === X ? 'tic' : 'tac');
  };

  const showResult = (result) => {
    infoDisplay.textContent = result;
    infoDisplay.classList.remove('hidden');
  };

  const resetBoard = () => {
    infoDisplay.classList.add('hidden');
    cells.forEach((cell) => {
      cell.classList.remove('tic', 'tac');
    });
  };

  return {
    markCell,
    showResult,
    resetBoard,
  };
})();
