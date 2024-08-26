// src/utils/createUserAndFamily.js
import { createClient } from '@supabase/supabase-js';

export const createUserAndFamily = async (email, password, familyName) => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // Benutzer registrieren (hier wird das Passwort intern von Supabase verarbeitet)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
    });

    if (signUpError) throw signUpError;

    const user = signUpData.user;

    // Erstelle den Familiencode
    const familycode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Trage den Benutzer in die "users" Tabelle ein
    const { data: userData, error: userError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        familycode: familycode,
        createdat: new Date(),
        is_admin: true, // Markiere den Benutzer als Admin
    });

    if (userError) throw userError;

    // Trage den Familiencode in die "families" Tabelle ein
    const { error: familyError } = await supabase.from('families').insert({
        familycode: familycode,
        createdby: user.id,
        members: { [user.id]: true },
        createdat: new Date(),
    });

    if (familyError) throw familyError;

    return { userId: user.id, familycode };
};

// API-Handler - src/pages/api/register.js
import { createUserAndFamily } from '../../../utils/createUserAndFamily';

export default async function handler(req, res) {
    const { email, password, familyName } = req.body;

    try {
        const { userId, familycode } = await createUserAndFamily(email, password, familyName);
        res.status(200).json({ userId, familycode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
