'use client';

import React, { useState, useEffect } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';

export default function ShoppingListPage() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const supabase = createClientInstance();

    useEffect(() => {
        fetchItems(); // Load shopping list items on component mount
    }, []);

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from('shoppinglist')
            .select('*')
            .order('inserted_at', { ascending: false });

        if (error) {
            console.error('Error fetching shopping list:', error.message);
        } else {
            console.log('Fetched items:', data);  // Debugging-Log
            setItems(data);
        }
    };

    const addItem = async () => {
        console.log('Attempting to add item:', newItem);  // Debugging-Log

        if (newItem.trim().length === 0) {
            setStatusMessage('Artikel darf nicht leer sein.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user);  // Debugging-Log

        const { error } = await supabase
            .from('shoppinglist')
            .insert([
                {
                    task: newItem.trim(),
                    user_id: user.id,
                    is_complete: false,
                    inserted_at: new Date(),
                },
            ]);

        if (error) {
            console.error('Error adding item:', error.message);
            setStatusMessage('Fehler beim Hinzufügen des Artikels.');
        } else {
            setNewItem('');
            setStatusMessage('Artikel erfolgreich hinzugefügt');
            await fetchItems(); // Aktualisiert die Liste
        }
    };

    const deleteItem = async (itemId) => {
        console.log('Attempting to delete item with id:', itemId);  // Debugging-Log

        const { error } = await supabase
            .from('shoppinglist')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error('Error deleting item:', error.message);
        }
        await fetchItems(); // Reload shopping list items after deletion
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Einkaufsliste</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="p-2 border rounded w-full"
                    placeholder="Neuer Artikel"
                />
                <button onClick={addItem} className="bg-blue-500 text-white p-2 rounded mt-2">
                    Artikel hinzufügen
                </button>
            </div>
            <ul>
                {items.length > 0 ? (
                    items.map((item) => (
                        <li key={item.id} className="flex justify-between mb-2">
                            <span>{item.task}</span>
                            <button
                                onClick={() => deleteItem(item.id)}
                                className="text-red-500"
                            >
                                Löschen
                            </button>
                        </li>
                    ))
                ) : (
                    <p>Keine Artikel verfügbar</p>
                )}
            </ul>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
}
