import './App.css';
import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning-square' : ''} ${value ? 'filled' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const { winner, winningSquares } = calculateWinner(squares) || {};
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(square => square)) {
    status = 'Game ended in a draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const renderSquare = (i) => (
    <Square
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      isWinningSquare={winningSquares?.includes(i)}
    />
  );

  return (
    <div className="game-area">
      <div className={`status ${winner ? 'winner-status' : ''}`}>
        {status}
      </div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, moveIndex) {
    const row = Math.floor(moveIndex / 3) + 1;
    const col = (moveIndex % 3) + 1;
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, moveLocation: { row, col } }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const description = move > 0
      ? `Go to move #${move} (${step.moveLocation.row}, ${step.moveLocation.col})`
      : 'Go to game start';

    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={move === currentMove ? 'current-move' : ''}
        >
          {description}
          {move === currentMove && <span> (Current)</span>}
        </button>
      </li>
    );
  });

  const sortedMoves = sortAscending ? moves : [...moves].reverse();

  return (
    <div className="game-container">
      <h1>Tic-Tac-Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <div className="controls">
            <button onClick={() => setSortAscending(!sortAscending)}>
              Sort: {sortAscending ? 'Descending' : 'Ascending'}
            </button>
          </div>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: [a, b, c]
      };
    }
  }
  return null;
}