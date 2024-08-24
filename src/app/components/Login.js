'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import supabase from '../../utils/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
           

      alert('Login erfolgreich!');
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
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="flex justify-between mt-4">
          <button onClick={handleNavigateToRegister} className="text-blue-500 hover:underline">
            Noch keinen Account? Jetzt registrieren
          </button>
        </div>
      </div>
    </div>
  );
}
