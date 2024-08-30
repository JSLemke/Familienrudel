'use client';

import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import WeatherWidget from './WeatherWidget';
import TasksPreview from './TasksPreview';
import ShoppingListPreview from './ShoppingListPreview';
import MiniMap from './MiniMap';
import TicTacToe from '../games/TicTacToe/TicTacToe';
import ChatIcon from './ChatIcon';
import createClient from 'src/utils/supabase/client.js';
import ChatPreview from './ChatPreview';
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

            if (!members) {
                members = {};
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
        <div className="family-dashboard p-8 space-y-4">
            {/* Leiste mit dem Familiencode und dem Chat-Icon */}
            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-md">
                <div>
                    <h2 className="text-2xl font-bold">Familie:</h2>
                    <p className="text-lg">{familyCode || 'Kein Familiencode zugeordnet'}</p>
                </div>
                <ChatIcon />
            </div>

            {/* Grid-Layout für die Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mini-calendar widget-container">
                    <MiniCalendar />
                </div>
                <div className="weather-widget widget-container">
                    <WeatherWidget />
                </div>
                <div className="tasks-preview widget-container">
                    <TasksPreview />
                </div>
                <div className="shopping-list-preview widget-container">
                    <ShoppingListPreview />
                </div>
                <div className="mini-map widget-container md:col-span-2">
                    <MiniMap />
                </div>
            </div>
        </div>
    );
}
