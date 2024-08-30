'use client';

import supabase from 'src/utils/supabase/client.js'; // Korrekte Importpfad für Supabase
import { useRouter } from 'next/navigation';
import React from 'react';

function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Weiterleitung zur spezifischen Login-Seite nach dem Logout
      router.push('/Login');
      // Stellen Sie sicher, dass dies der korrekte Pfad für Ihre Login-Komponente ist
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
      redirect('/Login');
    </div>
  );
}

export default Logout;
