// API-Handler - src/pages/api/register.js
import { createUserAndFamily } from 'src/utils/createUserAndFamily.js';

export default async function handler(req, res) {
    const { email, password, familyName } = req.body;

    try {
        const { userId, familycode } = await createUserAndFamily(email, password, familyName);
        res.status(200).json({ userId, familycode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
