'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';  

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }

        if (session) {
          const user = session.user;
          setUserName(user.email);
        } else {
          console.log('No user is logged in');
        }
      } catch (error) {
        console.error('Unexpected error fetching session:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">FamilyApp</h1>
      <div className="flex items-center space-x-4">
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
