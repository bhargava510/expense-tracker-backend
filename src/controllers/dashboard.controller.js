import { PERIODS, getRange } from '../config/periods.js';
import { getDashboard } from '../services/dashboard.service.js';
import { HttpError } from '../utils/httpError.js';

export function listPeriods(_req, res) {
  res.json(Object.entries(PERIODS).map(([key, p]) => ({ key, label: p.label, months: p.months, bucket: p.bucket })));
}

export async function getOne(req, res) {
  const periodKey = req.query.period || 'monthly';
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const range = getRange(periodKey, offset);
  if (!range) throw new HttpError(400, `Unknown period "${periodKey}". Valid: ${Object.keys(PERIODS).join(', ')}`);
  res.json(await getDashboard({ ...range, offset }));
}
