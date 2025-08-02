const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Creates a new citizen
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const createCitizen = async (req, res) => {
  try {
    const { name, phone, email, address, aadhar_no } = req.body;
    const pool = await initDatabase();
    const [result] = await pool.query(
      'INSERT INTO citizens (name, phone, email, address, aadhar_no) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email, address, aadhar_no]
    );
    res.status(201).json({ citizenId: result.insertId });
  } catch (error) {
    logger.error('Create citizen error:', error);
    res.status(500).json({ error: 'Failed to create citizen' });
  }
};

/**
 * Gets all citizens
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getCitizens = async (req, res) => {
  try {
    const pool = await initDatabase();
    const [citizens] = await pool.query('SELECT * FROM citizens');
    res.json(citizens);
  } catch (error) {
    logger.error('Get citizens error:', error);
    res.status(500).json({ error: 'Failed to fetch citizens' });
  }
};

module.exports = { createCitizen, getCitizens };