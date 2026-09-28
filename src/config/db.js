import pg from 'pg';
import { env } from './env.js';

// Return NUMERIC columns as JS numbers and DATE columns as 'YYYY-MM-DD' strings
pg.types.setTypeParser(1700, (v) => (v === null ? null : parseFloat(v)));
pg.types.setTypeParser(1082, (v) => v);

// Hosted Postgres (Neon, etc.) requires SSL; local Postgres usually doesn't.
const isLocal = /@(localhost|127\.0\.0\.1|db)(:|\/)/.test(env.databaseUrl);

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  // Keep the pool small: on Vercel each function instance has its own pool
  max: Number(process.env.PG_POOL_MAX) || (process.env.VERCEL ? 3 : 10),
  idleTimeoutMillis: 10_000,
});

export const query = (text, params) => pool.query(text, params);
