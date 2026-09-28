import * as service from '../services/expense.service.js';
import { validateExpense } from '../validators/expense.validator.js';
import { HttpError } from '../utils/httpError.js';

const parseId = (req) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid id');
  return id;
};

export async function list(req, res) {
  res.json(await service.listExpenses(req.query));
}

export async function getOne(req, res) {
  const expense = await service.getExpense(parseId(req));
  if (!expense) throw new HttpError(404, 'Expense not found');
  res.json(expense);
}

export async function create(req, res) {
  const { errors, value } = validateExpense(req.body);
  if (errors.length) throw new HttpError(400, errors);
  res.status(201).json(await service.createExpense(value));
}

export async function update(req, res) {
  const id = parseId(req);
  const { errors, value } = validateExpense(req.body);
  if (errors.length) throw new HttpError(400, errors);
  const updated = await service.updateExpense(id, value);
  if (!updated) throw new HttpError(404, 'Expense not found');
  res.json(updated);
}

export async function remove(req, res) {
  const deleted = await service.deleteExpense(parseId(req));
  if (!deleted) throw new HttpError(404, 'Expense not found');
  res.status(204).end();
}
