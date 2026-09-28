import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.corsOrigin.includes('*') ? true : env.corsOrigin }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ name: 'expense-tracker-api', health: '/api/health' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
