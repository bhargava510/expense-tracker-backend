import { HttpError } from '../utils/httpError.js';

// Postgres error codes → friendly client errors
const PG_ERRORS = {
  '23503': 'Invalid category',
  '22007': 'Invalid date',
  '22008': 'Invalid date',
};

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) return res.status(err.status).json({ errors: err.errors });
  if (PG_ERRORS[err.code]) return res.status(400).json({ errors: [PG_ERRORS[err.code]] });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ errors: ['Malformed JSON body'] });
  console.error(err);
  res.status(500).json({ errors: ['Internal server error'] });
}
