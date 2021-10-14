const X = 'x';
const O = 'o';

/*
    TODO: Clean up the interface to allow players to put in their names and add
    a display element that congratulates the winning player!
 */

/*
    TODO: create an AI for solo play
    make player selection disappear on game start
 */

const Player = (m, ai) => {
  const mark = m;
  const aiControlled = ai;

  const _getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const _chooseRandomCell = () => _getRandomIntInclusive(0, 8);

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
  let currentPlayer = playerOne;
  let started = false;
  let over = false;

  const _switchPlayers = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const _end = (player) => {
    displayController.togglePlayerSelectorsBlockVisibility();
    if (!player) {
      alert("It's a tie!");
    } else {
      const winner = player === playerOne ? 'player 1' : 'player 2';
      alert(`${winner} wins`);
    }
    over = true;
  };

  const start = () => {
    started = true;
    displayController.togglePlayerSelectorsBlockVisibility();
    if (currentPlayer.isAi()) currentPlayer.play();
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
      if (currentPlayer.isAi()) currentPlayer.play();
    }
  };

  const restart = () => {
    over = false;
    currentPlayer = playerOne;
    gameBoard.clearBoard();
    displayController.clearBoard();
  };

  const hasStarted = () => started;
  const isOver = () => over;

  const setPlayer = (mark, ai) => {
    if (mark === X) {
      playerOne = Player(mark, ai);
    } else {
      playerTwo = Player(mark, ai);
    }
  };

  return {
    start,
    playTurnAt,
    restart,
    hasStarted,
    isOver,
    setPlayer,
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
  // player selectors

  const playerSelectorsBlock = document.querySelector('.js-player-selectors');
  const togglePlayerSelectorsBlockVisibility = () => {
    playerSelectorsBlock.classList.toggle('hidden');
  };

  // player selection buttons

  const btnTicHuman = document.querySelector('.js-btn-tic-human');
  const btnTicAi = document.querySelector('.js-btn-tic-ai');
  const btnTacHuman = document.querySelector('.js-btn-tac-human');
  const btnTacAi = document.querySelector('.js-btn-tac-ai');
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

  // game field

  const cells = Array.from(document.querySelectorAll('.js-cell'));
  cells.forEach((cell) =>
    cell.addEventListener('click', (e) => {
      const i = cells.indexOf(e.target);
      if (game.isOver() || gameBoard.isCellFilled(i) || !game.hasStarted())
        return;
      game.playTurnAt(i);
    })
  );

  // start button

  const btnStart = document.querySelector('.js-btn-start');
  btnStart.onclick = game.start;

  // restart button

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
    togglePlayerSelectorsBlockVisibility,
  };
})();
