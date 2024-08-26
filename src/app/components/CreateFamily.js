'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../utils/auth';

export default function CreateFamily() {
    const [familyName, setFamilyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCreateFamily = async () => {
        try {
            const { familyCode } = await signUp(email, password, familyName);
            alert(`Family created with code: ${familyCode}`);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <div className="p-8 max-w-md w-full">
                <h1 className="text-4xl mb-6 text-center">Familiengruppe erstellen</h1>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Familienname"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
                        required
                    />
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
                        placeholder="Passwort"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
                        required
                    />
                    <button
                        onClick={handleCreateFamily}
                        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Familiengruppe erstellen
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}
