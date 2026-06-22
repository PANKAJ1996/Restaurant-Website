'use strict';

/**
 * Centralized error handling middleware.
 *
 * - notFound: handles unmatched routes (404).
 * - errorHandler: catches errors passed via next(err) or thrown in async
 *   handlers, and returns a consistent JSON error response. Stack traces
 *   are only exposed outside production.
 */

const config = require('../config/env');

function notFound(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;

  console.error(`[error] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);

  const body = {
    error: status >= 500 ? 'Internal Server Error' : 'Request Error',
    message: err.message || 'Something went wrong.',
  };

  if (!config.isProduction && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

module.exports = { notFound, errorHandler };
