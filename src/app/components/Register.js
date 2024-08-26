'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import createClientInstance from 'src/utils/supabase/client.js';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [familyCode, setFamilyCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const generateFamilyCode = () => {
        const newFamilyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setFamilyCode(newFamilyCode);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!familyCode) {
            setError('Bitte generieren Sie zuerst einen Familiencode');
            return;
        }

        try {
            const supabase = createClientInstance();

            // Zuerst den Benutzer registrieren
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) throw signUpError;

            const user = signUpData.user;

            // Benutzer in der 'users'-Tabelle einfügen
            const { error: insertUserError } = await supabase
                .from('users')
                .insert([
                    {
                        id: user.id,
                        email: user.email,
                        familycode: familyCode,
                        createdAt: new Date().toISOString(),
                    },
                ]);

            if (insertUserError) throw insertUserError;

            // Familie in der 'families'-Tabelle anlegen
            const { error: insertFamilyError } = await supabase
                .from('families')
                .insert([
                    {
                        familycode: familyCode,
                        createdby: user.id,
                        members: JSON.stringify({ [user.id]: true }),
                        createdat: new Date().toISOString(),
                    },
                ]);

            if (insertFamilyError) throw insertFamilyError;

            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <div className="p-8 max-w-md w-full">
                <h1 className="text-4xl mb-6 text-center">Registrieren</h1>
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <input
                        type="text"
                        placeholder="Familienname"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
                        required
                    />
                    <button
                        type="button"
                        onClick={generateFamilyCode}
                        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Familiencode generieren
                    </button>
                    {familyCode && (
                        <p className="text-green-500 text-center">
                            Ihr Familiencode: {familyCode}
                        </p>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Jetzt registrieren
                    </button>
                </form>
            </div>
        </div>
    );
}
