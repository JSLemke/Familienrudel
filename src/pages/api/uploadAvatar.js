import { createClient } from '../../utils/supabase/server';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = createClient(req, res);
        const { user } = await client.auth.api.getUserByCookie(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const file = req.body.file; // Erwartet Base64-kodierte Datei oder eine Datei aus einem FormData-Objekt
        const filePath = `avatars/${user.id}-${Date.now()}`;
        const { data, error } = await client.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
            });

        if (error) {
            throw error;
        }

        const publicUrl = client.storage.from('avatars').getPublicUrl(filePath).publicURL;

        // Avatar-URL in der Benutzerdatenbank speichern
        await client
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

        return res.status(200).json({ url: publicUrl });
    } catch (error) {
        console.error('Fehler beim Avatar-Upload:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
