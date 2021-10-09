const X = 'x';
const O = 'o';

const Player = (m) => {
  const mark = m;

  const getMark = () => mark;

  return {
    getMark,
  };
};

const game = (() => {
  let playerOne = Player(X);
  let playerTwo = Player(O);
  let currentPlayer = playerOne;

  const _switchPlayers = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const playTurnAt = (i) => {
    const mark = currentPlayer.getMark();
    gameBoard.setCell(mark, i);
    displayController.markCell(mark, i);
    _switchPlayers();
  };

  return {
    playTurnAt,
  };
})();

const gameBoard = (() => {
  /*   let board = [X, X, X, null, null, O, O, O, X]; */
  let board = [null, null, null, null, null, null, null, null, null];

  const getBoard = () => board;
  const setCell = (mark, i) => {
    board[i] = mark;
  };
  const isCellFilled = (i) => {
    return !!board[i];
  };

  return {
    getBoard,
    setCell,
    isCellFilled,
  };
})();

const displayController = (() => {
  const cells = Array.from(document.querySelectorAll('.js-cell'));
  cells.forEach((cell) =>
    cell.addEventListener('click', (e) => {
      const i = +e.target.dataset.index;
      if (gameBoard.isCellFilled(i)) return;
      game.playTurnAt(i);
    })
  );

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

/* (() => {})(); */
