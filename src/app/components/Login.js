// src/app/components/Login.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import createClientInstance from 'src/utils/supabase/client.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClientInstance();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Verwende den korrekt initialisierten Supabase-Client
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw new Error(signInError.message);

      const user = signInData.user;

      // Überprüfe den Familiencode
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('familycode', familyCode)
        .single();

      if (familyError || !familyData) {
        throw new Error('Invalid family code.');
      }

      // Überprüfe, ob der Benutzer zur Familie gehört
      const members = familyData.members || {};
      if (!members[user.id]) {
        throw new Error('User is not part of this family.');
      }

      // Speichere den Familiencode im Benutzerprofil (optional)
      await supabase
        .from('users')
        .update({ familycode: familyCode })
        .eq('id', user.id);

      // Weiterleitung zum Dashboard
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-4xl mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Passwort"
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
            placeholder="Familiencode"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-700"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-gray-500 to-gray-800 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="flex justify-between mt-4">
          <button onClick={handleNavigateToRegister} className="text-white hover:underline">
            Noch keinen Account? Jetzt registrieren
          </button>
        </div>
      </div>
    </div>
  );
}
