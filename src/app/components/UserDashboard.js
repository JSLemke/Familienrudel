'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [shoppingItems, setShoppingItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*');
        if (tasksError) throw tasksError;

        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*');
        if (notesError) throw notesError;

        const { data: shoppingData, error: shoppingError } = await supabase
          .from('shoppingList')
          .select('*');
        if (shoppingError) throw shoppingError;

        setTasks(tasksData || []);
        setNotes(notesData || []);
        setShoppingItems(shoppingData || []);
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);  
      }
    };

    fetchData();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const { error } = await supabase
          .from('tasks')
          .insert({ content: newTask });
        if (error) throw error;
        setNewTask('');
      } catch (err) {
        console.error('Fehler beim Hinzufügen der Aufgabe:', err.message);
      }
    }
  };

  const addNote = async () => {
    if (newNote.trim()) {
      try {
        const { error } = await supabase
          .from('notes')
          .insert({ content: newNote });
        if (error) throw error;
        setNewNote('');
      } catch (err) {
        console.error('Fehler beim Hinzufügen der Notiz:', err.message);
      }
    }
  };

  const addShoppingItem = async () => {
    if (newItem.trim()) {
      try {
        const { error } = await supabase
          .from('shoppingList')
          .insert({ content: newItem });
        if (error) throw error;
        setNewItem('');
      } catch (err) {
        console.error('Fehler beim Hinzufügen des Artikels:', err.message);
      }
    }
  };

  const deleteItem = async (collectionName, id) => {
    try {
      const { error } = await supabase
        .from(collectionName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Fehler beim Löschen des Elements:', err.message);
    }
  };

  if (loading) {
    return <p>Lade das Benutzerdashboard...</p>;  
  }

  if (error) {
    return <p>Fehler: {error}</p>;
  }

  return (
    <div className="user-dashboard p-8">
      <h1 className="text-3xl mb-4">Dein Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl mb-2">Tagesaufgaben</h2>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Neue Aufgabe hinzufügen"
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={addTask} className="p-2 ml-2 bg-blue-500 text-white rounded">Hinzufügen</button>
        <ul className="mt-4">
          {tasks.map((task) => (
            <li key={task.id} className="mb-2 flex justify-between">
              {task.content}
              <button onClick={() => deleteItem('tasks', task.id)} className="text-red-500">Löschen</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-2">Notizen</h2>
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Neue Notiz hinzufügen"
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={addNote} className="p-2 ml-2 bg-blue-500 text-white rounded">Hinzufügen</button>
        <ul className="mt-4">
          {notes.map((note) => (
            <li key={note.id} className="mb-2 flex justify-between">
              {note.content}
              <button onClick={() => deleteItem('notes', note.id)} className="text-red-500">Löschen</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-2">Einkaufsliste</h2>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Neuen Artikel hinzufügen"
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={addShoppingItem} className="p-2 ml-2 bg-blue-500 text-white rounded">Hinzufügen</button>
        <ul className="mt-4">
          {shoppingItems.map((item) => (
            <li key={item.id} className="mb-2 flex justify-between">
              {item.content}
              <button onClick={() => deleteItem('shoppingList', item.id)} className="text-red-500">Löschen</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
