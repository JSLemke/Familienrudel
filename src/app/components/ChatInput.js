'use client';

import { useState } from 'react';
import supabase from 'src/utils/supabase/client.js'; // Korrekte Importpfad für Supabase

const ChatInput = ({ chatId }) => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (message.trim()) {
      const { error } = await supabase
        .from('messages')
        .insert([{ chatId, text: message, createdAt: new Date() }]);

      if (error) console.error('Error sending message:', error.message);
      setMessage('');
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tippe deine Nachricht..."
      />
      <button onClick={sendMessage}>Senden</button>
    </div>
  );
};

export default ChatInput;
