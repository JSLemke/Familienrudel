import React, { useEffect, useState } from 'react';
import createClientInstance from 'src/utils/supabase/client';

const ContactList = ({ familyCode = "defaultFamilyCode" }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const supabase = createClientInstance(); // Rufe den Supabase-Client ab

      if (!familyCode) {
        console.error("Family Code is missing!");
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('familycode', familyCode); // Filterung nach dem übergebenen Familiencode

      if (error) {
        console.error('Error fetching contacts:', error.message);
      } else {
        setContacts(data);
      }
    };

    fetchContacts();
  }, [familyCode]);

  return (
    <div>
      <h2>Kontakte</h2>
      {contacts.length > 0 ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>{contact.nickname || contact.email}</li>
          ))}
        </ul>
      ) : (
        <p>Keine Kontakte gefunden oder Familiencode wird geladen...</p>
      )}
    </div>
  );
};

export default ContactList;
