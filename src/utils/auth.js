import supabase from './supabaseClient'; 
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
};


export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('SignIn Error:', error.message); 
    throw new Error(error.message);
  }

  console.log('SignIn Data:', data); 

  if (!data || !data.user) {
    console.error('User not found in the returned data:', data);
    throw new Error('Anmeldung fehlgeschlagen.');
  }

  return data;
};
