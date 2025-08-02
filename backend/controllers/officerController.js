const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Creates a new officer
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const createOfficer = async (req, res) => {
  try {
    const { name, designation, phone, email, dept_id } = req.body;
    const pool = await initDatabase();
    const [result] = await pool.query(
      'INSERT INTO officers (name, designation, phone, email, dept_id) VALUES (?, ?, ?, ?, ?)',
      [name, designation, phone, email, dept_id]
    );
    res.status(201).json({ officerId: result.insertId });
  } catch (error) {
    logger.error('Create officer error:', error);
    res.status(500).json({ error: 'Failed to create officer' });
  }
};

/**
 * Gets all officers
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getOfficers = async (req, res) => {
  try {
    const pool = await initDatabase();
    const [officers] = await pool.query('SELECT * FROM officers');
    res.json(officers);
  } catch (error) {
    logger.error('Get officers error:', error);
    res.status(500).json({ error: 'Failed to fetch officers' });
  }
};

module.exports = { createOfficer, getOfficers };