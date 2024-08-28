import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient(req, res) {
    try {
        const client = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                global: {
                    headers: { 'x-forwarded-host': req.headers['x-forwarded-host'] },
                },
                auth: {
                    storage: {
                        getItem: (key) => req.cookies[key],
                        setItem: (key, value) => res.cookie(key, value),
                        removeItem: (key) => res.clearCookie(key),
                    },
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
