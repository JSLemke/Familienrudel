'use client';

import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import WeatherWidget from './WeatherWidget';
import TasksPreview from './TasksPreview';
import ShoppingListPreview from './ShoppingListPreview';
import ChatIcon from './ChatIcon';
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
        <div className="family-dashboard p-8">
            <h1 className="text-3xl mb-4">Familiendashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="bg-gray-100 p-4 mb-4 rounded flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Familie:</h2>
                    <p className="text-lg">{familyCode || 'Kein Familiencode zugeordnet'}</p>
                </div>
                <ChatIcon />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MiniCalendar />
                <WeatherWidget />
                <TasksPreview />
                <ShoppingListPreview />
                <MiniMap />
            </div>
        </div>
    );
}
