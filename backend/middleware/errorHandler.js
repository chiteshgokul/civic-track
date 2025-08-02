 const logger = require('../utils/logger');

/**
 * Centralized error handler
 * @param {Error} err - Error object
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 * @param {express.NextFunction} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = { errorHandler };