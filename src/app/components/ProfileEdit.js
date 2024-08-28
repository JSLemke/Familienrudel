import React, { useState, useEffect } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';
import UploadAvatar from './UploadAvatar';

export default function ProfileEdit() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [userId, setUserId] = useState(null);
  const supabase = createClientInstance();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
        } else {
          setNickname(data.nickname);
          setPhotoURL(data.photo_url || '/default-profile.png');
          setEmail(data.email);
          setBio(data.bio);
        }
      }
    };

    fetchUserData();
  }, [supabase]);

  const handleSave = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('users')
      .update({
        nickname,
        photo_url: photoURL, // Make sure this is set correctly
        email,
        bio
      })
      .eq('id', userId);

    if (error) {
      console.error('Error saving profile:', error.message);
    } else {
      alert('Profile updated successfully');
    }
  };

  const handleAvatarChange = (url) => {
    setPhotoURL(url); // Set the new photoURL
  };

  return (
    <div className="profile-edit p-8">
      <h1 className="text-3xl mb-4">Edit Profile</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        {userId && <UploadAvatar userId={userId} onUpload={handleAvatarChange} />}
        {photoURL && <img src={photoURL} alt="Avatar" className="mt-4 rounded-full w-24 h-24 object-cover" />}
        <button
          onClick={handleSave}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
