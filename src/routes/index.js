import { Router } from 'express';
import { pool } from '../config/db.js';
import expenseRoutes from './expense.routes.js';
import categoryRoutes from './category.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true }); }
  catch { res.status(503).json({ ok: false }); }
});
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
