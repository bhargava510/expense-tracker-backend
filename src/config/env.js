import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 4000,
  //databaseUrl: 'postgresql://localhost:5432/bhargavabirineni?sslmode=disable',
  databaseUrl: 'postgresql://neondb_owner:npg_4nxcl2LiuHvh@ep-morning-sun-a7tv5xc9.ap-southeast-2.aws.neon.tech/neondb?sslmode=require',
  // Comma-separated list of allowed frontend origins, or * to allow any
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim().replace(/\/$/, '')),
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env (or set it in Vercel project settings).');
}
