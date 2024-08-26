import { useState, useEffect, useRef } from 'react';
import supabase from 'src/utils/supabase/client.js'; // Verwende den Supabase-Client

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chatId', chatId)
        .order('createdAt', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
        return;
      }

      setMessages(data);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    fetchMessages();

    const messagesSubscription = supabase
      .channel(`public:messages:chatId=${chatId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [chatId]);

  return (
    <div className="chat-window">
      {messages.map(message => (
        <div key={message.id} className="chat-message">
          {message.text}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
