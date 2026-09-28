import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: 'postgresql://localhost:5432/bhargavabirineni?sslmode=disable',
  // Comma-separated list of allowed frontend origins, or * to allow any
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim().replace(/\/$/, '')),
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env (or set it in Vercel project settings).');
}
