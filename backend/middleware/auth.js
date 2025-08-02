 const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Authenticates requests with JWT
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 * @param {express.NextFunction} next - Next middleware function
 */
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Restricts access to admins
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 * @param {express.NextFunction} next - Next middleware function
 */
const restrictToAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authenticate, restrictToAdmin };