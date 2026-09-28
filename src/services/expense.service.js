import { query } from '../config/db.js';

const SELECT = `
  SELECT e.id, e.title, e.amount, e.spent_on AS "spentOn", e.payment_method AS "paymentMethod",
         e.notes, e.category_id AS "categoryId", c.name AS category, c.color
  FROM expenses e JOIN categories c ON c.id = e.category_id`;

export async function listExpenses({ from, to, categoryId, search, limit = 50, offset = 0 }) {
  const where = [];
  const params = [];
  const add = (sql, v) => { params.push(v); where.push(sql.replace('?', `$${params.length}`)); };
  if (from) add('e.spent_on >= ?', from);
  if (to) add('e.spent_on <= ?', to);
  if (categoryId) add('e.category_id = ?', Number(categoryId));
  if (search) add('e.title ILIKE ?', `%${search}%`);
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const [list, count] = await Promise.all([
    query(`${SELECT} ${whereSql} ORDER BY e.spent_on DESC, e.id DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`, params),
    query(`SELECT COUNT(*)::int AS total, COALESCE(SUM(amount),0) AS sum FROM expenses e ${whereSql}`, params),
  ]);
  return { items: list.rows, total: count.rows[0].total, sum: count.rows[0].sum };
}

export async function getExpense(id) {
  const { rows } = await query(`${SELECT} WHERE e.id = $1`, [id]);
  return rows[0] || null;
}

export async function createExpense(v) {
  const { rows } = await query(
    `INSERT INTO expenses (title, amount, category_id, spent_on, payment_method, notes)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [v.title, v.amount, v.categoryId, v.spentOn, v.paymentMethod, v.notes]
  );
  return getExpense(rows[0].id);
}

export async function updateExpense(id, v) {
  const { rowCount } = await query(
    `UPDATE expenses SET title=$1, amount=$2, category_id=$3, spent_on=$4, payment_method=$5, notes=$6, updated_at=now()
     WHERE id=$7`,
    [v.title, v.amount, v.categoryId, v.spentOn, v.paymentMethod, v.notes, id]
  );
  return rowCount ? getExpense(id) : null;
}

export async function deleteExpense(id) {
  const { rowCount } = await query('DELETE FROM expenses WHERE id = $1', [id]);
  return rowCount > 0;
}
