import express from 'express';
import { supabase } from './db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const token = req.headers.authorization;
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "Не авторизован" });
  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const token = req.headers.authorization;
  const { title } = req.body;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data, error } = await supabase.from('tasks').insert([{ title, user_id: user.id, is_completed: false }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// НОВЫЙ МЕТОД: РЕДАКТИРОВАНИЕ
router.put('/:id', async (req, res) => {
  const token = req.headers.authorization;
  const { title } = req.body;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data, error } = await supabase.from('tasks').update({ title }).eq('id', req.params.id).eq('user_id', user.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

router.patch('/:id/complete', async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;
  const { is_completed } = req.body;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { error: taskError } = await supabase.from('tasks').update({ is_completed }).eq('id', id).eq('user_id', user.id);
  if (taskError) return res.status(400).json({ error: taskError.message });
  if (is_completed) { await supabase.rpc('increment_points', { user_id: user.id, amount: 10 }); }
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const token = req.headers.authorization;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { error } = await supabase.from('tasks').delete().eq('id', req.params.id).eq('user_id', user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Удалено" });
});

export default router;