// src/app/components/Register.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error('User sign-up failed');

      const generatedFamilyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { error: docError } = await supabase.from('users').insert([
        {
          id: user.id,
          email: user.email,
          familycode: generatedFamilyCode, 
          createdAt: new Date().toISOString(),
        },
      ]);
      if (docError) throw docError;

      
      const { error: familyError } = await supabase.from('families').insert([
        {
          familycode: generatedFamilyCode,
          createdby: user.id,
          members: JSON.stringify({ [user.id]: true }),
          createdat: new Date().toISOString(),
        },
      ]);

      if (familyError) throw familyError;

      alert('User and family group created successfully');
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-4xl mb-6 text-center">Register</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-700"
            required
          />
          <button
            type="submit"
            onClick={handleSignUp}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Jetzt registrieren
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
