// src/app/components/Families.js

import { useEffect, useState } from 'react';

export default function Families() {
    const [families, setFamilies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFamilies() {
            const response = await fetch('https://nabqqbbwcdvwjepgffvx.supabase.co/rest/v1/families?select=familycode,createdby', {
                method: 'GET',
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setError('Error fetching families');
                return;
            }

            const data = await response.json();
            setFamilies(data);
        }

        fetchFamilies();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Families</h1>
            <ul>
                {families.map((family) => (
                    <li key={family.familycode}>{family.familycode}</li>
                ))}
            </ul>
        </div>
    );
}
