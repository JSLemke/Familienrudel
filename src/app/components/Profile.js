'use client';
import React, { useState, useEffect } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';

export default function Profile() {
  const [nickname, setNickname] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const supabase = createClientInstance();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error.message);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('nickname, photo_url, email, bio')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
        } else {
          setNickname(data.nickname);
          setEmail(data.email);
          setBio(data.bio);
          setPhotoURL(data.photo_url || '/default-profile.png');
        }
      }
    };

    fetchUserData();
  }, [supabase]);

  return (
    <div className="profile p-8">
      <h1 className="text-3xl mb-4">Profil</h1>
      <div className="space-y-4">
        <img src={photoURL} alt="Profilbild" className="w-24 h-24 rounded-full object-cover" />
        <div>
          <p className="text-xl font-semibold">{nickname}</p>
          <p>{email}</p>
          <p>{bio}</p>
        </div>
      </div>
    </div>
  );
}
