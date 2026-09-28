const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Validates and normalises an expense payload. Returns { errors, value }. */
export function validateExpense(body = {}) {
  const errors = [];
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const amount = Number(body.amount);
  const categoryId = Number(body.categoryId);
  const spentOn = body.spentOn;

  if (!title) errors.push('Title is required');
  if (title.length > 200) errors.push('Title must be 200 characters or fewer');
  if (!Number.isFinite(amount) || amount <= 0) errors.push('Amount must be a positive number');
  if (!Number.isInteger(categoryId)) errors.push('Category is required');
  if (!DATE_RE.test(spentOn || '') || Number.isNaN(Date.parse(spentOn))) errors.push('Date must be YYYY-MM-DD');

  return {
    errors,
    value: {
      title,
      amount: Math.round(amount * 100) / 100,
      categoryId,
      spentOn,
      paymentMethod: body.paymentMethod?.trim() || null,
      notes: body.notes?.trim() || null,
    },
  };
}

export function validateCategory(body = {}) {
  const name = body.name?.trim();
  const color = /^#[0-9a-f]{6}$/i.test(body.color || '') ? body.color : '#8d8b85';
  return { errors: name ? [] : ['Name is required'], value: { name, color } };
}
