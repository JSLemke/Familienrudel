'use client';

import { useEffect, useState } from 'react';
import supabase from 'src/utils/supabase/client.js'; // Richtiger Importpfad für Supabase

const GroupList = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*');

      if (error) console.error('Error fetching groups:', error.message);
      else setGroups(data);
    };

    fetchGroups();
  }, []);

  return (
    <div className="group-list">
      {groups.map((group) => (
        <div key={group.id} onClick={() => onSelectGroup(group.id)}>
          {group.name}
        </div>
      ))}
    </div>
  );
};

export default GroupList;
