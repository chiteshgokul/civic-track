 const { v4: uuidv4 } = require('uuid');
const { initDatabase } = require('../config/database');
const notificationService = require('../services/notificationService');
const storageService = require('../services/storageService');
const logger = require('../utils/logger');

/**
 * Creates a new report
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const createReport = async (req, res) => {
  try {
    const { title, description, categoryId, latitude, longitude } = req.body;
    const files = req.files || [];
    const userId = req.user ? req.user.userId : null;
    const token = userId ? null : uuidv4();
    const pool = await initDatabase();
    
    const [result] = await pool.query(
      `INSERT INTO reports (user_id, title, description, category_id, location, token)
       VALUES (?, ?, ?, ?, ST_GeomFromText('POINT(? ?)', 4326), ?)`,
      [userId, title, description, categoryId, latitude, longitude, token]
    );
    
    const reportId = result.insertId;
    
    // Store photos
    const photoUrls = await Promise.all(
      files.map(file => storageService.uploadPhoto(file))
    );
    for (const url of photoUrls) {
      await pool.query('INSERT INTO photos (report_id, url) VALUES (?, ?)', [reportId, url]);
    }
    
    // Log initial status
    await pool.query('INSERT INTO status_logs (report_id, status) VALUES (?, ?)', [reportId, 'Reported']);
    
    // Notify user (simulated)
    notificationService.notifyStatusUpdate(reportId, 'Reported');
    
    res.status(201).json({ reportId, token });
  } catch (error) {
    logger.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

/**
 * Gets reports within radius
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getReports = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, status, categoryId } = req.query;
    const pool = await initDatabase();
    let query = `
      SELECT r.report_id, r.title, r.description, r.status, c.name AS category,
             ST_X(r.location) AS latitude, ST_Y(r.location) AS longitude,
             (SELECT COUNT(*) FROM flags f WHERE f.report_id = r.report_id) AS flag_count
      FROM reports r
      JOIN categories c ON r.category_id = c.category_id
      WHERE ST_Distance_Sphere(r.location, ST_GeomFromText('POINT(? ?)', 4326)) <= ?
        AND (SELECT COUNT(*) FROM flags f WHERE f.report_id = r.report_id) < 3
    `;
    const params = [latitude, longitude, radius];
    
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    if (categoryId) {
      query += ' AND r.category_id = ?';
      params.push(categoryId);
    }
    
    const [reports] = await pool.query(query, params);
    res.json(reports);
  } catch (error) {
    logger.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

/**
 * Updates report status
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const updateStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const pool = await initDatabase();
    
    await pool.query('UPDATE reports SET status = ? WHERE report_id = ?', [status, reportId]);
    await pool.query('INSERT INTO status_logs (report_id, status) VALUES (?, ?)', [reportId, status]);
    
    notificationService.notifyStatusUpdate(reportId, status);
    res.json({ message: 'Status updated' });
  } catch (error) {
    logger.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = { createReport, getReports, updateStatus };