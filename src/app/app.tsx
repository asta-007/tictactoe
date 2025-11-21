"use client";
import React, { useState, useEffect } from 'react';
import { RotateCcw, Cpu } from 'lucide-react';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ player: 0, bot: 0, draws: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  // Initialize Farcaster Mini App SDK (optional)
  useEffect(() => {
    const initializeSdk = async () => {
      try {
        // Only initialize if running in Farcaster
        if (typeof window !== 'undefined' && window.sdk) {
          // Just mark as ready, don't request wallet
          await window.sdk.actions.ready();
        }
        setSdkReady(true);
      } catch (error) {
        // Continue even if SDK fails - game works standalone
        setSdkReady(true);
      }
    };
    
    initializeSdk();
  }, []);

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
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  // Moved inside useEffect to avoid dependency issues

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];
  const isBoardFull = board.every(cell => cell !== null);
  const isDraw = !winner && isBoardFull;

  // Bot move logic
  useEffect(() => {
    if (!isXNext && !winner && !isDraw) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        let botMove;

        // Try to win
        for (const i of emptyIndices) {
          const testBoard = [...board];
          testBoard[i] = 'O';
          if (calculateWinner(testBoard)?.winner === 'O') {
            botMove = i;
            break;
          }
        }

        // Block player from winning
        if (botMove === undefined) {
          for (const i of emptyIndices) {
            const testBoard = [...board];
            testBoard[i] = 'X';
            if (calculateWinner(testBoard)?.winner === 'X') {
              botMove = i;
              break;
            }
          }
        }

        // Take center if available
        if (botMove === undefined && board[4] === null) {
          botMove = 4;
        }

        // Take a corner
        if (botMove === undefined) {
          const corners = [0, 2, 6, 8];
          const availableCorners = corners.filter(i => board[i] === null);
          if (availableCorners.length > 0) {
            botMove = availableCorners[Math.floor(Math.random() * availableCorners.length)];
          }
        }

        // Take any available space
        if (botMove === undefined && emptyIndices.length > 0) {
          botMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }

        if (botMove !== undefined) {
          const newBoard = [...board];
          newBoard[botMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          
          const newResult = calculateWinner(newBoard);
          if (newResult) {
            setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
          } else if (newBoard.every(cell => cell !== null)) {
            setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          }
        }
        setIsThinking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, isDraw]);

  // Auto-restart game after win/draw
  useEffect(() => {
    if (winner || isDraw) {
      const timer = setTimeout(() => {
        resetGame();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [winner, isDraw]);

  const handleClick = (index) => {
    if (board[index] || winner || !isXNext || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const newResult = calculateWinner(newBoard);
    if (newResult) {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      setIsXNext(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      setIsXNext(true);
    } else {
      setIsXNext(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsThinking(false);
  };

  const resetScores = () => {
    setScores({ player: 0, bot: 0, draws: 0 });
    resetGame();
  };

  if (!sdkReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>
        
        {/* Score Board */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="text-lg font-medium text-blue-600">You (X)</div>
            <div className="text-2xl font-bold text-gray-700">{scores.player}</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-600">Draws</div>
            <div className="text-lg font-semibold text-gray-700">{scores.draws}</div>
          </div>
          <div className="bg-red-100 rounded-lg p-3">
            <div className="text-lg font-medium text-red-600 flex items-center justify-center gap-1">
              <Cpu size={16} /> Bot (O)
            </div>
            <div className="text-2xl font-bold text-gray-700">{scores.bot}</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-2xl font-bold">
              {winner === 'X' ? (
                <span className="text-green-600">🎉 You Win! 🎉</span>
              ) : (
                <span className="text-red-600">Bot Wins!</span>
              )}
            </div>
          ) : isDraw ? (
            <div className="text-2xl font-bold text-gray-600">
              It&apos;s a Draw!
            </div>
          ) : isThinking ? (
            <div className="text-xl font-semibold text-red-600 flex items-center justify-center gap-2">
              <Cpu className="animate-pulse" size={24} />
              Bot is thinking...
            </div>
          ) : (
            <div className="text-xl font-semibold text-blue-600">
              Your turn!
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, index) => {
            const isWinningCell = winningLine.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={isThinking}
                className={`aspect-square text-5xl font-bold rounded-xl transition-all duration-200 
                  ${cell || isThinking ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'}
                  ${isWinningCell ? 'bg-green-200 scale-105' : 'bg-gray-50'}
                  ${cell === 'X' ? 'text-blue-600' : 'text-red-600'}
                  ${!cell && !winner && !isThinking ? 'hover:shadow-md' : ''}
                  ${isThinking ? 'opacity-60' : ''}
                  border-2 border-gray-200`}
              >
                {cell}
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={resetGame}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            New Game
          </button>
          <button
            onClick={resetScores}
            className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
