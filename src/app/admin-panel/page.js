'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';

export default function AdminPanel() {
  const [members, setMembers] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGroupMembers = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, members')
        .eq('createdBy', supabase.auth.user().id);

      if (error) {
        console.error('Error fetching group members:', error.message);
        return;
      }

      if (data.length > 0) {
        const group = data[0];
        setSelectedGroupId(group.id);
        setMembers(group.members || []);
      } else {
        router.push('/create-group');
      }
    };

    fetchGroupMembers();
  }, [router]);

  const handleRemoveMember = async (memberId) => {
    try {
      const updatedMembers = members.filter((member) => member !== memberId);
      const { error } = await supabase
        .from('groups')
        .update({ members: updatedMembers })
        .eq('id', selectedGroupId);

      if (error) throw error;

      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error removing member:', error.message);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Manage Group Members</h2>
      <ul>
        {members.map((memberId) => (
          <li key={memberId}>
            {memberId}
            <button onClick={() => handleRemoveMember(memberId)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
    </div>
  );
}
