/**
 * Centralized error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles three cases:
 *  - express-jwt UnauthorizedError  → 401
 *  - Mongoose ValidationError       → 400
 *  - Everything else                → 500
 */
const errorHandler = (err, req, res, next) => {
  // JWT auth failure
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized: invalid or missing token' });
  }

  // Mongoose validation failure
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Validation error', errors: messages });
  }

  // Log unexpected errors server-side only
  console.error(err);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  return res.status(status).json({ message });
};

module.exports = errorHandler;
