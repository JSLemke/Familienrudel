'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';

export default function GroupDetail({ groupId }) {
  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupData = async () => {
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) {
        console.error('Group not found', error.message);
        router.push('/');
      } else {
        console.log('Fetched group:', data);  
        setGroup(data);
      }
    };

    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('User not authenticated', error.message);
        return;
      }
      setUser(user);
    };

    fetchGroupData();
    fetchUserData();
  }, [groupId, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('groupId', groupId)
        .order('createdAt', { ascending: true });

      if (error) console.error('Error fetching messages:', error.message);
      else setMessages(data);
    };

    fetchMessages();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase
        .from('messages')
        .insert([{ text: newMessage, createdAt: new Date(), user: user.id, groupId }]);

      if (error) console.error('Error sending message:', error.message);
      setNewMessage('');
    }
  };

  const handleJoinGroup = async () => {
    if (user) {
      const { error } = await supabase
        .from('families')
        .update({ members: JSON.stringify({ ...group.members, [user.id]: true }) })
        .eq('id', groupId);

      if (error) console.error('Error joining group:', error.message);
      else setGroup({ ...group, members: { ...group.members, [user.id]: true } });
    }
  };

  const handleLeaveGroup = async () => {
    if (user) {
      const newMembers = { ...group.members };
      delete newMembers[user.id];

      const { error } = await supabase
        .from('families')
        .update({ members: JSON.stringify(newMembers) })
        .eq('id', groupId);

      if (error) console.error('Error leaving group:', error.message);
      else setGroup({ ...group, members: newMembers });
    }
  };

  return (
    <div>
      {/* Gruppen-UI hier */}
      <div>
        {messages.map((message) => (
          <div key={message.id}>{message.text}</div>
        ))}
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Senden</button>
      </div>
      {/* Gruppenmitgliedschafts-Buttons */}
    </div>
  );
}
