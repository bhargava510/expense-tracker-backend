import * as service from '../services/category.service.js';
import { validateCategory } from '../validators/expense.validator.js';
import { HttpError } from '../utils/httpError.js';

export async function list(_req, res) {
  res.json(await service.listCategories());
}

export async function create(req, res) {
  const { errors, value } = validateCategory(req.body);
  if (errors.length) throw new HttpError(400, errors);
  res.status(201).json(await service.createCategory(value));
}
