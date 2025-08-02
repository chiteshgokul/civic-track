const { initDatabase } = require('../config/database');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

/**
 * Creates a new complaint
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const createComplaint = async (req, res) => {
  try {
    const { citizen_id, dept_id, description } = req.body;
    const pool = await initDatabase();
    const [result] = await pool.query(
      'INSERT INTO complaints (citizen_id, dept_id, description, status) VALUES (?, ?, ?, ?)',
      [citizen_id, dept_id, description, 'Pending']
    );
    const complaintId = result.insertId;
    notificationService.notifyComplaintStatus(complaintId, 'Pending');
    res.status(201).json({ complaintId });
  } catch (error) {
    logger.error('Create complaint error:', error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
};

/**
 * Updates complaint status
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    const pool = await initDatabase();
    await pool.query('UPDATE complaints SET status = ? WHERE complaint_id = ?', [status, complaintId]);
    notificationService.notifyComplaintStatus(complaintId, status);
    res.json({ message: 'Complaint status updated' });
  } catch (error) {
    logger.error('Update complaint status error:', error);
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
};

/**
 * Gets all complaints
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getComplaints = async (req, res) => {
  try {
    const { status, dept_id } = req.query;
    const pool = await initDatabase();
    let query = `
      SELECT c.complaint_id, c.description, c.status, c.created_at, 
             ci.name AS citizen_name, d.dept_name
      FROM complaints c
      JOIN citizens ci ON c.citizen_id = ci.citizen_id
      JOIN departments d ON c.dept_id = d.dept_id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }
    if (dept_id) {
      query += ' AND c.dept_id = ?';
      params.push(dept_id);
    }
    const [complaints] = await pool.query(query, params);
    res.json(complaints);
  } catch (error) {
    logger.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

module.exports = { createComplaint, updateComplaintStatus, getComplaints };