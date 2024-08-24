'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function ChatPreview() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Fehler beim Abrufen der Nachrichten', error.message);
      } else {
        setMessages(data);
      }
    };

    fetchRecentMessages();
  }, []);

  return (
    <div className="chat-preview p-4 bg-gray-200 rounded-lg">
      <h2 className="text-xl mb-2">Letzte Nachrichten</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id} className="text-sm mb-2">
            {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
