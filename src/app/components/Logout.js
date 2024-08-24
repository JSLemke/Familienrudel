'use client';

import supabase from '../../utils/supabaseClient'; 
import { useRouter } from 'next/navigation';
import React from 'react';

function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Logout</h2>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Confirm Logout
      </button>
    </div>
  );
}

export default Logout;
