// 404 handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
};

// Central error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Basic error shape
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    error: err.name || 'Error',
    message,
    details: err.details || undefined,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

