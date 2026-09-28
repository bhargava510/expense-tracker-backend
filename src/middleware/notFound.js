export function notFound(req, res) {
  res.status(404).json({ errors: [`Route ${req.method} ${req.originalUrl} not found`] });
}
