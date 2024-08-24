'use client';

import { useState } from 'react';

export default function Invite() {
  const [inviteCode, setInviteCode] = useState('');

  const generateInviteCode = async () => {
    try {
      const response = await fetch('http://localhost:3001/generateInviteCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: 'your-uid-here' }),
      });

      const data = await response.json();
      setInviteCode(data.inviteCode);
    } catch (error) {
      console.error('Error generating invite code:', error.message);
    }
  };

  return (
    <div>
      <button onClick={generateInviteCode}>Generate Invite Code</button>
      {inviteCode && <p>Your invite code: {inviteCode}</p>}
    </div>
  );
}
