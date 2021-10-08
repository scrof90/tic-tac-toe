const X = 'x';
const O = 'o';

const gameBoard = (() => {
  let board = [X, X, X, null, null, O, O, O, X];
  const getBoard = () => board;
  const markCell = (mark, index) => {
    board[index] = mark;
  };
  return {
    getBoard,
    markCell,
  };
})();

const displayController = (() => {
  const cells = Array.from(document.querySelectorAll('.js-cell'));
  const updateBoard = () => {
    const board = gameBoard.getBoard();
    board.forEach((el, i) => {
      if (!el) {
        cells[i].classList.remove('tic', 'tac');
      } else {
        const mark = el === X ? 'tic' : 'tac';
        cells[i].classList.add(mark);
      }
    });
  };
  return {
    updateBoard,
  };
})();

const Player = (play) => {
  const mark = play;
  return {};
};

const game = (() => {
  let playerOne = Player(X);
  let playerTwo = Player(O);
  let currentPlayer = playerOne;
  return {};
})();

(() => {
  displayController.updateBoard();
})();
