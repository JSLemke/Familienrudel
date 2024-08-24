'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';
import Picker from 'emoji-picker-react';

export default function ChatPage({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});

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
        .order('created_at', { ascending: true })
        .eq('receiver_id', receiverId);

      if (error) {
        console.error('Fehler beim Abrufen der Nachrichten:', error.message);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId) {
      const { error } = await supabase
        .from('messages')
        .insert([{ 
          sender_id: userId,  
          receiver_id: receiverId, 
          content: newMessage,
          created_at: new Date(), 
        }]);

      if (error) {
        console.error('Fehler beim Senden der Nachricht:', error.message);
      } else {
        setNewMessage(''); 
        setShowEmojiPicker(false);
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md w-full mx-auto mt-6">
      <div className="chat-box h-96 overflow-y-scroll p-4">
        {messages.map((message) => (
          <div key={message.id} className="message mb-4 flex items-start">
            <div>
              <p className="text-sm font-semibold">
                {message.sender_id === userId ? 'You' : 'Other User'}
              </p>
              <p className="bg-gray-700 p-2 rounded-lg text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 relative">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
          placeholder="Type a message"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-12 top-2 text-xl"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 right-0 z-10">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <button
          onClick={handleSendMessage}
          className="mt-2 p-2 w-full bg-blue-500 rounded text-white hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
