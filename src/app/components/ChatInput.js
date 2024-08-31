'use client';

import { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message); // Debugging: Überprüfen, ob diese Zeile erreicht wird
      onSendMessage(message);
      setMessage(''); // Nachricht zurücksetzen
    } else {
      console.log('Empty message, not sending.'); // Debugging: Wenn Nachricht leer ist
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tippe deine Nachricht..."
        onKeyDown={handleKeyDown} // Senden bei Enter
        className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
      />
      <button onClick={handleSend} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Senden
      </button>
    </div>
  );
};

export default ChatInput;
