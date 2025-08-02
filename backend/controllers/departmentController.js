const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Creates a new department
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const createDepartment = async (req, res) => {
  try {
    const { dept_name, contact_no } = req.body;
    const pool = await initDatabase();
    const [result] = await pool.query(
      'INSERT INTO departments (dept_name, contact_no) VALUES (?, ?)',
      [dept_name, contact_no]
    );
    res.status(201).json({ deptId: result.insertId });
  } catch (error) {
    logger.error('Create department error:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

/**
 * Gets all departments
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getDepartments = async (req, res) => {
  try {
    const pool = await initDatabase();
    const [departments] = await pool.query('SELECT * FROM departments');
    res.json(departments);
  } catch (error) {
    logger.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

module.exports = { createDepartment, getDepartments };