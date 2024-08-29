// src/app/components/games/TicTacToe.js
import React, { useState } from 'react';
import './TicTacToe.css';

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board)) return;
        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const calculateWinner = (squares) => {
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
                return squares[a];
            }
        }
        return null;
    };

    const winner = calculateWinner(board);
    const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`;

    return (
        <div className="tictactoe-container">
            <div className="tictactoe-status">{status}</div>
            <div className="tictactoe-board">
                {board.map((value, index) => (
                    <div 
                        key={index} 
                        className="tictactoe-cell" 
                        onClick={() => handleClick(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TicTacToe;
