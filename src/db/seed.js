// Inserts ~14 months of realistic sample expenses so the dashboards have data.
import { pool } from '../config/db.js';

const templates = [
  ['Rent', 'Monthly rent', 1800, 1800, 1],
  ['Utilities', 'Electricity bill', 90, 180, 1],
  ['Utilities', 'Internet', 75, 75, 1],
  ['Groceries', 'Supermarket run', 60, 180, 6],
  ['Dining Out', 'Dinner', 30, 120, 4],
  ['Transport', 'Fuel / transit', 25, 80, 5],
  ['Entertainment', 'Movies / streaming', 15, 60, 2],
  ['Health', 'Pharmacy', 15, 90, 1],
  ['Shopping', 'Clothes / household', 40, 250, 2],
  ['Other', 'Misc', 10, 60, 2],
];

const toIso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const rand = (min, max) => Math.round((min + Math.random() * (max - min)) * 100) / 100;

try {
  const { rows: cats } = await pool.query('SELECT id, name FROM categories');
  const catId = Object.fromEntries(cats.map((c) => [c.name, c.id]));
  const today = new Date();
  const values = [];

  for (let m = 13; m >= 0; m--) {
    const year = today.getFullYear();
    const month = today.getMonth() - m;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (const [cat, title, min, max, times] of templates) {
      for (let i = 0; i < times; i++) {
        const day = cat === 'Rent' ? 1 : 1 + Math.floor(Math.random() * daysInMonth);
        const d = new Date(year, month, day);
        if (d > today) continue;
        values.push([title, rand(min, max), catId[cat], toIso(d), Math.random() > 0.5 ? 'Card' : 'Cash']);
      }
    }
    // Occasional trip
    const trip = new Date(year, month, 15);
    if (m % 5 === 2 && trip <= today) values.push(['Weekend trip', rand(400, 1200), catId.Travel, toIso(trip), 'Card']);
  }

  for (const v of values) {
    await pool.query(
      'INSERT INTO expenses (title, amount, category_id, spent_on, payment_method) VALUES ($1,$2,$3,$4,$5)',
      v
    );
  }
  console.log(`Seeded ${values.length} expenses.`);
} catch (err) {
  console.error('Seeding failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
