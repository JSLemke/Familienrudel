// src/app/components/ShoppingListPreview.js
'use client';

import React, { useEffect, useState } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';

export default function ShoppingListPreview() {
    const supabase = createClientInstance();
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        const fetchShoppingList = async () => {
            const { data, error } = await supabase
                .from('shoppinglist')
                .select('*');

            if (error) {
                console.error('Error fetching shopping list:', error.message);
            } else {
                setShoppingList(data);
            }
        };

        fetchShoppingList();
    }, []);

    return (
        <div className="p-4 bg-gradient-to-r from-black to-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-zinc-100">Einkaufsliste</h2>
            <ul>
                {shoppingList.slice(0, 3).map((item, index) => (
                    <li key={index} className="mb-2">
                        {item.task}
                    </li>
                ))}
            </ul>
        </div>
    );
}
