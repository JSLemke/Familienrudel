'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

export default function Invite() {
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteLink = async () => {
    const familyId = Cookies.get('familyId'); // Holt die familyId aus dem Cookie

    if (!familyId) {
      console.error('Family ID is not set');
      return;
    }

    try {
      const response = await fetch('/api/generateInviteLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: familyId }),
      });

      const data = await response.json();
      if (data.error) {
        console.error('Fehler beim Generieren des Einladungslinks:', data.error);
      } else {
        setInviteLink(data.inviteLink);
      }
    } catch (error) {
      console.error('Fehler beim Generieren des Einladungslinks:', error.message);
    }
  };

  return (
    <div style={{ color: 'white' }}>
      <button
        onClick={generateInviteLink}
        style={{
          backgroundColor: '#007BFF',
          color: '#FFF',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Generate Invite Link
      </button>
      {inviteLink && (
        <div style={{ marginTop: '20px', color: 'white' }}>
          <p>Your invite link:</p>
          <input
            type="text"
            value={inviteLink}
            readOnly
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #CCC',
              backgroundColor: '#333',
              color: '#FFF',
            }}
          />
        </div>
      )}
    </div>
  );
}
