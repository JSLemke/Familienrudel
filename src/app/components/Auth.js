'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';  // Verwende die bereits erstellte Instanz

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert('User registered successfully. Please check your email to confirm your account.');
      router.push('/login');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-4xl mb-6 text-center">Login</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-900"
            required
          />
          <button
            onClick={handleSignIn}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="w-full p-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
