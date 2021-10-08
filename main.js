const X = 'x';
const O = 'o';

const gameBoard = (() => {
  let board = [X, X, X, null, null, O, O, O, X];
})();

const displayController = (() => {})();

const Player = (mark) => {
  const _mark = mark;
  return {};
};

const playerOne = Player(X);
const playerTwo = Player(O);
