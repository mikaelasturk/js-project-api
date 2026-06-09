// Global error handler middleware
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    status,
    error: err.message || "Internal Server Error",
    details: err.details || null,
  });
}
