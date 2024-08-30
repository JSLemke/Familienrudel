'use client';

import React, { useState } from 'react';
import ChatPage from './ChatPage';

export default function ChatIcon() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="text-2xl p-2 rounded-full bg-gray-500 text-white"
      >
        💬
      </button>
      {isChatOpen && (
        <div className="absolute right-0 top-0 mt-2 w-96 h-[32rem] bg-white shadow-lg rounded-lg p-4 z-50">
          <ChatPage receiverId="example-receiver-id" senderId="example-sender-id" />
          <button
            onClick={() => setIsChatOpen(false)}
            className="absolute top-2 right-2 text-gray-600"
          >
            ✖️
          </button>
        </div>
      )}
    </div>
  );
}
