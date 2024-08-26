// src/pages/api/fetchFamilies.js

export default async function handler(req, res) {
    const response = await fetch('https://nabqqbbwcdvwjepgffvx.supabase.co/rest/v1/families?select=familycode,createdby', {
        method: 'GET',
        headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        return res.status(response.status).json({ error: 'Error fetching data from Supabase' });
    }

    const data = await response.json();
    res.status(200).json(data);
}
