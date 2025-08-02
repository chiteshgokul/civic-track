const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Gets all categories
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getCategories = async (req, res) => {
  try {
    const pool = await initDatabase();
    const [categories] = await pool.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = { getCategories };