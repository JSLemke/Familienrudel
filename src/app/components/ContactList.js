'use client';

import React, { useEffect, useState } from 'react';
import supabase from 'src/utils/supabase/client.js'; // Verwende den Supabase-Client

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) console.error('Error fetching contacts:', error.message);
      else setContacts(data);
    };

    fetchContacts();
  }, []);

  return (
    <div>
      <h2>Kontakte</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>{contact.displayName || contact.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
