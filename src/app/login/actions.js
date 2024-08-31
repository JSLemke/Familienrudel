'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData) {
  const supabase = createClient();
  const email = formData.get('email');
  const password = formData.get('password');

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/error');
  }

  revalidatePath('/');
  // Leite nach erfolgreichem Login zur Dashboard-Seite weiter
  redirect('/dashboard');
}

export async function signup(formData) {
  const supabase = createClient();
  const email = formData.get('email');
  const password = formData.get('password');

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect('/error');
  }

  revalidatePath('/');
  // Leite nach erfolgreichem Signup zur Dashboard-Seite weiter
  redirect('/dashboard');
}

// Beispiel für eine Logout-Funktion
export async function logout() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  // Leite nach erfolgreichem Logout zur Login-Seite weiter
  redirect('/Login.js');
}
