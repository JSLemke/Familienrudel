'use client';

import React, { useState, useEffect } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';
import dynamic from 'next/dynamic';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function ChatPage({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});

  const supabase = createClientInstance();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('users')
          .select('nickname, photo_url')
          .eq('id', user.id)
          .single();
        if (data) {
          setUserData(data);
        } else {
          console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
        }
      }
    };

    fetchUserId();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Fehler beim Abrufen der Nachrichten:', error.message);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [supabase]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    if (userId) {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: userId,
          receiver_id: receiverId || userId,
          content: newMessage.trim(),
          sent_at: new Date(),
        }]);

      if (error) {
        console.error('Fehler beim Senden der Nachricht:', error.message);
      } else {
        setNewMessage('');
        setShowEmojiPicker(false);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container bg-gradient-to-tr from-indigo-700 to-indigo-950 text-white p-4 rounded-lg shadow-lg max-w-lg w-full mx-auto mt-6">
      <div className="chat-box h-180 w-full bg-gradient-to-tr from-indigo-700 to-indigo-950 rounded-lg overflow-y-scroll p-8">
        {messages.map((message) => (
          <div key={message.id} className="message mb-4 flex items-start">
            <div>
              <p className="text-sm font-semibold">
                {message.sender_id === userId ? 'Du' : 'Andere Person'}
              </p>
              <p className="bg-gradient-to-tr from-indigo-700 to-indigo-950 p-4 rounded-lg text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 relative">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="p-5 w-full rounded bg-gradient-to-tr from-indigo-700 to-indigo-900 border border-gray-600 text-white focus:outline-none"
          placeholder="Nachricht eingeben"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-12 top-5 text-xl"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-10 right-0 z-10">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <button
          onClick={handleSendMessage}
          className="mt-4 p-4 w-full bg-gradient-to-tr from-indigo-700 to-indigo-950 rounded text-white hover:bg-gray-600"
        >
          Senden
        </button>
      </div>
    </div>
  );
}
