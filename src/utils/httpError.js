export class HttpError extends Error {
  constructor(status, errors) {
    const list = Array.isArray(errors) ? errors : [errors];
    super(list.join('. '));
    this.status = status;
    this.errors = list;
  }
}

// Wraps async route handlers so rejected promises reach the error middleware
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
