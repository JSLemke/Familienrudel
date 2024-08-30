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
