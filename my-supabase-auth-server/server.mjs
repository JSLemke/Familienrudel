import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { supabase } from './supabase.js';

dotenv.config({ path: 'GHub-jane/my-supabase-auth-server/.env' });

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/createInviteCode', async (req, res) => {
  const { familyId, createdBy } = req.body;
  const inviteCode = Math.random().toString(36).substring(2, 15);

  try {
    const { error } = await supabase
      .from('families')
      .insert({ inviteCode, createdBy, createdAt: new Date(), members: { [createdBy]: true } });

    if (error) throw error;

    res.json({ inviteCode });
  } catch (error) {
    res.status(500).send(`Error creating invite code: ${error.message}`);
  }
});

app.post('/joinFamily', async (req, res) => {
  const { inviteCode, userId } = req.body;

  try {
    const { data: family, error } = await supabase
      .from('families')
      .select('*')
      .eq('inviteCode', inviteCode)
      .single();

    if (error || !family) {
      res.status(404).send('Invite code not found');
    } else {
      const { error: updateError } = await supabase
        .from('families')
        .update({ [`members.${userId}`]: true })
        .eq('id', family.id);

      if (updateError) throw updateError;

      res.json({ success: true, familyId: family.id });
    }
  } catch (error) {
    res.status(500).send(`Error joining family: ${error.message}`);
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
