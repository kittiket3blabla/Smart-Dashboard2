import express from 'express';
import { supabase } from './db.js';

const router = express.Router();

// ПОЛУЧИТЬ ТОП ПОЛЬЗОВАТЕЛЕЙ
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, points')
    .order('points', { ascending: false })
    .limit(10);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;