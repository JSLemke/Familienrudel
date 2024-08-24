'use client';

import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const user = supabase.auth.user();

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .contains('members', [user.id]);

      if (error) {
        console.error('Error fetching groups:', error.message);
        return;
      }

      setGroups(data);
    };

    fetchGroups();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Groups</h1>
      {groups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <ul>
          {groups.map(group => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Groups;
