import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient(req, res) {
    try {
        // Überprüfen, ob req und req.headers definiert sind
        const headers = req?.headers ? { 'x-forwarded-host': req.headers['x-forwarded-host'] } : {};

        // Supabase Client erstellen
        const client = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                auth: {
                    persistSession: false, // Manuelles Persistieren der Session vermeiden
                },
                global: {
                    headers: headers, // Setzt die Header nur, wenn sie definiert sind
                },
            }
        );

        console.log('Supabase Client erfolgreich erstellt');
        return client;
    } catch (error) {
        console.error('Fehler bei der Erstellung des Supabase Clients:', error);
        throw error;
    }
}

// Hinzufügen des neuen Endpunktes zur Unterstützung der Chat-Preview-Funktion
export default async function handler(req, res) {
    const supabase = createClient(req, res); // Verwende den bestehenden Supabase-Client

    if (req.method === 'POST') {
        const { chatId, message } = req.body;

        // Nachrichtenspeicherung
        if (chatId && message) {
            const { data, error } = await supabase
                .from('messages')
                .insert([{ chat_id: chatId, content: message, sent_at: new Date() }]);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ data });
        } else {
            return res.status(400).json({ error: 'Missing chatId or message' });
        }
    } else if (req.method === 'GET' && req.query.preview) {
        // Chat-Preview Funktion
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ data });
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
