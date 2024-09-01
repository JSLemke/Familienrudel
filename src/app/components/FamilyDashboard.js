'use client';

import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import WeatherWidget from './WeatherWidget';
import TasksPreview from './TasksPreview';
import ShoppingListPreview from './ShoppingListPreview';
import dynamic from 'next/dynamic';
import createClient from 'src/utils/supabase/client.js';

const MiniMap = dynamic(() => import('./MiniMap'), { ssr: false });

export default function FamilyDashboard() {
    const [familyCode, setFamilyCode] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFamilyCode = async () => {
            try {
                const supabase = createClient();
                const { data: userData, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    setError('Fehler beim Abrufen des Benutzers: ' + userError.message);
                    console.error(userError.message);
                    return;
                }

                const user = userData?.user;

                if (user) {
                    setUserId(user.id);

                    const { data, error } = await supabase
                        .from('users')
                        .select('familycode')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        setError('Fehler beim Abrufen des Familiencodes: ' + error.message);
                        console.error(error.message);
                    } else if (data && data.familycode) {
                        setFamilyCode(data.familycode);
                        await addToFamilyTable(data.familycode, user.id);
                    } else {
                        setError('Kein Familiencode gefunden.');
                    }
                }
            } catch (err) {
                setError('Ein unerwarteter Fehler ist aufgetreten.');
                console.error(err);
            }
        };

        fetchFamilyCode();
    }, []);

    const addToFamilyTable = async (familyCode, userId) => {
        try {
            const supabase = createClient();
            const { data: family, error: fetchError } = await supabase
                .from('families')
                .select('members')
                .eq('familycode', familyCode)
                .single();

            if (fetchError) {
                setError('Fehler beim Abrufen der Familienmitglieder: ' + fetchError.message);
                console.error(fetchError.message);
                return;
            }

            let members = family?.members;

            // Stelle sicher, dass members ein Objekt ist
            if (typeof members !== 'object' || members === null) {
                console.error('Erwartetes Objekt, aber etwas anderes gefunden');
                members = {};  // Setze es auf ein leeres Objekt
            }

            if (!members[userId]) {
                members[userId] = true;

                const { error: updateError } = await supabase
                    .from('families')
                    .update({ members })
                    .eq('familycode', familyCode);

                if (updateError) {
                    setError('Fehler beim Hinzufügen des Benutzers zur Familien-Tabelle: ' + updateError.message);
                    console.error(updateError.message);
                } else {
                    console.log('Benutzer erfolgreich zur Familien-Tabelle hinzugefügt.');
                }
            }
        } catch (err) {
            setError('Ein unerwarteter Fehler ist beim Hinzufügen zur Familie aufgetreten.');
            console.error(err);
        }
    };

    return (
        <div className="family-dashboard h-full">
            {error && <p className="text-red-500">{error}</p>}
            <div className="bg-gray-800 text-stone-100 p-2 mb-2 rounded flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Familie</h2>
                    <div className="flex items-center space-x-2">
                        <p className="text-lg">{familyCode || 'Kein Familiencode zugeordnet'}</p>
                        <button
                            onClick={() => navigator.clipboard.writeText(familyCode || '')}
                            className="bg-gray-500 hover:bg-gray-400 active:bg-green-500 text-black px-2 py-1 rounded text-sm transition-colors"
                        >
                            Kopieren
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-2 items-center">
                <TasksPreview className="h-full" />
                <ShoppingListPreview className="h-full" />
                <div className="lg:col-span-2 grid md:grid-cols-1 lg:grid-cols-3 gap-2 items-center">
                    <MiniCalendar className="h-full" />
                    <WeatherWidget className="h-full" />
                    <MiniMap className="h-full" />
                </div>
            </div>
        </div>
    );
}