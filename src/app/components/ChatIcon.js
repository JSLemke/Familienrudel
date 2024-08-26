// src/app/components/ChatIcon.js
'use client';

import React, { useState } from 'react';
import ChatPage from './ChatPage';

export default function ChatIcon() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="text-2xl p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
      >
        💬
      </button>
      {isChatOpen && (
        <div className="absolute right-0 mt-2 w-80 h-96 bg-white shadow-lg rounded-lg p-4">
          <ChatPage receiverId="example-receiver-id" />
        </div>
      )}
    </div>
  );
}
