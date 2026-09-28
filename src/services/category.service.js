import { query } from '../config/db.js';

export async function listCategories() {
  const { rows } = await query('SELECT id, name, color FROM categories ORDER BY name');
  return rows;
}

export async function createCategory({ name, color }) {
  const { rows } = await query(
    `INSERT INTO categories (name, color) VALUES ($1,$2)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, color`,
    [name, color]
  );
  return rows[0];
}
