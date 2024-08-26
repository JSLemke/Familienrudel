import { createUserAndFamily } from '../../utils/createUserAndFamily';

export default async function handler(req, res) {
  const { email, password, familyName } = req.body;

  try {
    const { userId, familyCode } = await createUserAndFamily(email, password, familyName);
    res.status(200).json({ userId, familyCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
