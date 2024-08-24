'use client';

import supabase from '../../utils/supabaseClient';

export default function ProfileSettings() {
  const handleDeleteAccount = async () => {
    const user = supabase.auth.user();

    if (user) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) throw error;
        alert('Benutzer erfolgreich gelöscht');
      } catch (error) {
        alert('Fehler beim Löschen des Benutzers: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h1>Profile Settings</h1>
      <button onClick={handleDeleteAccount}>Konto löschen</button>
    </div>
  );
}
