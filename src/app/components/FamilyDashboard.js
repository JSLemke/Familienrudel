// src/app/components/FamilyDashboard.js
'use client';

import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import WeatherWidget from './WeatherWidget';
import TasksPreview from './TasksPreview';
import ShoppingListPreview from './ShoppingListPreview';
import ChatIcon from './ChatIcon';
import dynamic from 'next/dynamic';

const MiniMap = dynamic(() => import('./MiniMap'), { ssr: false });
import supabase from '../../utils/supabaseClient';

export default function FamilyDashboard() {
  const [familyCode, setFamilyCode] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFamilyCode = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setError('Fehler beim Abrufen des Benutzers: ' + userError.message);
        console.error(userError.message);
        return;
      }

      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from('users')
          .select('familyCode')
          .eq('id', user.id)
          .single();

        if (error) {
          setError('Fehler beim Abrufen des Familiencodes: ' + error.message);
          console.error(error.message);
        } else if (data && data.familyCode) {
          setFamilyCode(data.familyCode);
          await addToFamilyTable(user.id, data.familyCode);
        } else {
          setError('Kein Familiencode gefunden.');
        }
      }
    };

    fetchFamilyCode();
  }, []);

  const addToFamilyTable = async (userId, familyCode) => {
    const { data: family, error: fetchError } = await supabase
      .from('families')
      .select('members')
      .eq('familycode', familyCode)
      .maybeSingle();

    if (fetchError) {
      setError('Fehler beim Abrufen der Familienmitglieder: ' + fetchError.message);
      console.error(fetchError.message);
      return;
    }

    if (!family) {
      setError('Familie nicht gefunden oder es gibt mehr als eine Übereinstimmung.');
      return;
    }

    let members = family?.members || [];

    if (typeof members === 'string') {
      try {
        members = JSON.parse(members);
      } catch (parseError) {
        setError('Fehler beim Parsen der Mitgliederliste: ' + parseError.message);
        console.error(parseError.message);
        return;
      }
    }

    if (!Array.isArray(members)) {
      setError('Fehler: Die Mitgliederliste ist kein gültiges Array.');
      return;
    }

    if (!members.includes(userId)) {
      members.push(userId);
    }

    const { error: updateError } = await supabase
      .from('families')
      .update({ members: JSON.stringify(members) })
      .eq('familycode', familyCode);

    if (updateError) {
      setError('Fehler beim Hinzufügen des Benutzers zur Familien-Tabelle: ' + updateError.message);
      console.error(updateError.message);
    } else {
      console.log('Benutzer erfolgreich zur Familien-Tabelle hinzugefügt.');
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
