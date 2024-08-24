'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('shoppinglist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shopping list:', error.message);
    } else {
      setItems(data);
    }
  };

  useEffect(() => {
    fetchItems(); 
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      const { error } = await supabase
        .from('shoppinglist')
        .insert([{ item_name: newItem, created_at: new Date() }]);

      if (error) {
        console.error('Error adding item:', error.message);
      } else {
        setNewItem(''); 
        setStatusMessage('Artikel erfolgreich hinzugefügt');
        await fetchItems(); 
      }
    }
  };

  const deleteItem = async (itemId) => {
    const { error } = await supabase
      .from('shoppinglist')
      .delete()
      .eq('id', itemId);

    if (error) console.error('Error deleting item:', error.message);
    await fetchItems(); 
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
              <span>{item.item_name}</span>
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
