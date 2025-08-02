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
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };
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