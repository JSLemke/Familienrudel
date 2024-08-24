import supabase from './supabase.js';

const deleteUserById = async (uid) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(uid);
    if (error) throw error;
    console.log('Benutzer erfolgreich gelöscht');
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error.message);
  }
};

// Beispiel: Benutzer mit bestimmter UID löschen
deleteUserById('benutzer-uid');
