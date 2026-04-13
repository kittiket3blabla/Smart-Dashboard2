import express from 'express';
import { supabase } from './db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const token = req.headers.authorization;
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "Не авторизован" });
  const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const token = req.headers.authorization;
  const { title, content } = req.body;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data, error } = await supabase.from('notes').insert([{ title, content, user_id: user.id }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// НОВЫЙ МЕТОД: РЕДАКТИРОВАНИЕ
router.put('/:id', async (req, res) => {
  const token = req.headers.authorization;
  const { title, content } = req.body;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data, error } = await supabase.from('notes').update({ title, content }).eq('id', req.params.id).eq('user_id', user.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/:id', async (req, res) => {
  const token = req.headers.authorization;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { error } = await supabase.from('notes').delete().eq('id', req.params.id).eq('user_id', user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Заметка удалена" });
});

export default router;