import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button 
        className="square" 
        onClick={props.onClick}
        style={{ backgroundColor: props.isWinner ? '#f00' : '#0ff' }}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        key={i}
        isWinner={(this.props.comboVictory && ~this.props.comboVictory.indexOf(i)) ? true : false}
      />
    );
  }

  renderBoard() {
    let board = [];
    let countCells = 3;
    let countRows = 3;
    let step = 0;

    let i;
    for(i = 0; i < countRows; i++) {
      let squares = [];
      
      let j = 0;
      for(j = 0; j < countCells; j++, step++) {
        squares.push(this.renderSquare(step));
      }
      
      board.push(<div key={i} className="board-row">{squares}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {
          this.renderBoard()
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        cordsOfMove: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendOrder: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    if (winner || current.squares[i]) {
      return;
    }

    const newSquares = current.squares.slice();
    newSquares[i] = this.state.xIsNext ? 'X' : 'O';

    const cordsOfMove = cords[i]; // don't need immutable, since this data never update
    
    this.setState({
      history: history.concat([
        {
          squares: newSquares,
          cordsOfMove: cordsOfMove,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  toJump(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleOrder() {
    this.setState({
      ascendOrder: !this.state.ascendOrder,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to the move #' + move + ' ' :
        'Go to the start';
        
      let formatCords = '';
      if (step.cordsOfMove)
        formatCords = `Column: ${step.cordsOfMove[0]}. Row: ${step.cordsOfMove[1]}`;

      return (
        <li key={move}>
          <button 
            onClick={() => this.toJump(move)}
            style={{ fontWeight: (this.state.stepNumber === move) ? 'bold' : 'normal' }}
          >
            {desc} 
            {formatCords}
          </button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = 'Winner: ' + winner.playerName;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            onClick={i => this.handleClick(i)}
            squares={current.squares}
            comboVictory={(winner && winner.comboVictory) || null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleOrder()}>
            {
              this.state.ascendOrder ? 
              'Descend order' :
              'Ascend order'
            }
          </button>
          <ol>
            {
              this.state.ascendOrder ?
              moves : 
              [...moves].reverse()
            }
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// need function for translate from index 0-8 to number column and row
// or tricky convert, somehow via divide or %.
const cords = [
  ['1', '1'],
  ['1', '2'],
  ['1', '3'],
  ['2', '1'],
  ['2', '2'],
  ['2', '3'],
  ['3', '1'],
  ['3', '2'],
  ['3', '3'],
];

function calculateWinner(squares) {
  if (!~squares.indexOf(null)) {
    return {
      playerName: 'Draw',
    };
  }

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        comboVictory: lines[i],
        playerName: squares[a],
      };
    }
  }
  return null;
}