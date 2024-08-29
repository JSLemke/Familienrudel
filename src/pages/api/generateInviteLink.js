import { createClient } from 'src/utils/supabase/server';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { uid } = req.body; // uid kommt jetzt aus dem Cookie

        if (!uid) {
            return res.status(400).json({ error: 'Family ID is required' });
        }

        const supabase = createClient(req, res);

        const { data, error } = await supabase
            .from('families')
            .select('familycode')
            .eq('id', uid)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const familycode = data.familycode;
        const inviteLink = `http://localhost:3000/register?familycode=${familycode}`;

        return res.json({ inviteLink });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
