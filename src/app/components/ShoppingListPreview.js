'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export default function ShoppingListPreview() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchShoppingList = async () => {
      const { data, error } = await supabase
        .from('shoppinglist') 
        .select('*');

      if (error) {
        console.error('Error fetching shopping list:', error.message);
      } else {
        setItems(data);
      }
    };

    fetchShoppingList();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Einkaufsliste</h2>
      <ul>
        {items.slice(0, 3).map((item, index) => (
          <li key={index} className="mb-2">
            {item.item_name} 
          </li>
        ))}
      </ul>
    </div>
  );
}
