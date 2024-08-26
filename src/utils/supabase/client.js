import { createClient } from '@supabase/supabase-js';

// Singleton Pattern zur Initialisierung des Supabase-Clients
let supabase = null;

export default function createClientInstance() {
    if (!supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase URL und Anon Key müssen gesetzt sein.");
        }

        // Initialisiere den Supabase-Client mit allen relevanten Optionen
        supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true, // Ermöglicht die Sitzung über mehrere Tabs hinweg
                autoRefreshToken: true, // Automatische Token-Aktualisierung
                detectSessionInUrl: true, // Erkennt Auth-Token in der URL
            },
            realtime: {
                params: {
                    eventsPerSecond: 10, // Kontrolle der Realtime-Events
                },
            },
            db: {
                schema: 'public', // Standard-Schema einstellen
            },
        });
    }
    return supabase;
}
