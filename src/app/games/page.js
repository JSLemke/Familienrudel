// src/app/games/page.js
'use client';

import React from 'react';
import { useRouter } from 'next/router';

export default function GamesPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => router.push('/tictactoe')}
      >
        Tic Tac Toe
      </button>
      <button 
        className="px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={() => router.push('/tetris')}
      >
        Tetris
      </button>
      <button 
        className="px-4 py-2 bg-red-500 text-white rounded-md"
        onClick={() => router.push('/memory')}
      >
        Memory
      </button>
    </div>
  );
  
}
