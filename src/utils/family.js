import supabase from './supabaseClient';

export const createFamily = async (familyCode, userId) => {
    const { data, error } = await supabase
        .from('families')
        .insert([
            {
                familycode: familyCode,
                createdby: userId,
                createdat: new Date().toISOString(),
                members: { [userId]: true }, 
            },
        ]);

    if (error) {
        console.error('Fehler beim Erstellen der Familie:', error);
        return null;
    }

    return data;
};

export const addUserToFamily = async (familyCode, userId) => {
  const { data: family, error: familyError } = await supabase
      .from('families')
      .select('members')
      .eq('familycode', familyCode)
      .single();

  if (familyError) {
      console.error('Familie nicht gefunden:', familyError);
      return null;
  }

  const updatedMembers = { ...family.members, [userId]: true };

  const { error } = await supabase
      .from('families')
      .update({ members: updatedMembers })
      .eq('familycode', familyCode);

  if (error) {
      console.error('Fehler beim Hinzufügen des Benutzers zur Familie:', error);
      return null;
  }

  return updatedMembers;
};
