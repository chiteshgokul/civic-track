const { v4: uuidv4 } = require('uuid');
const { initDatabase } = require('../config/database');
const notificationService = require('../services/notificationService');
const { savePhoto } = require('../services/storageService');
const logger = require('../utils/logger');

/**
 * Creates a new report
 */
const createReport = async (req, res) => {
  try {
    logger.info('Report submission:', {
      body: req.body,
      files: req.files,
      user: req.user,
    });

    // Parse and validate fields
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const categoryId = parseInt(req.body.categoryId, 10);
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const files = req.files || [];
    const userId = req.user ? req.user.userId : null;
    const token = userId ? null : uuidv4();

    if (!title || !description || isNaN(categoryId) || isNaN(latitude) || isNaN(longitude)) {
      logger.error('Missing or invalid fields', { title, description, categoryId, latitude, longitude });
      return res.status(400).json({ error: 'All fields are required and must be valid.' });
    }

    const pool = await initDatabase();

    // Insert report
    const [result] = await pool.query(
      `INSERT INTO reports (user_id, title, description, category_id, location, token)
       VALUES (?, ?, ?, ?, ST_GeomFromText('POINT(? ?)', 4326), ?)`,
      [userId, title, description, categoryId, latitude, longitude, token]
    );
    const reportId = result.insertId;

    // Save photos (if any)
    const photoIds = [];
    for (const file of files) {
      try {
        const photoId = await savePhoto(file, reportId);
        photoIds.push(photoId);
      } catch (fileErr) {
        logger.error('Photo save error:', fileErr);
        // Optionally, you can continue or return error here
      }
    }

    await pool.query('INSERT INTO status_logs (report_id, status) VALUES (?, ?)', [reportId, 'Reported']);
    notificationService.notifyStatusUpdate(reportId, 'Reported');

    res.status(201).json({ reportId, token, photoIds });
  } catch (error) {
    logger.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report', details: error.message });
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
             (SELECT COUNT(*) FROM flags f WHERE f.report_id = r.report_id) AS flag_count,
             (SELECT JSON_ARRAYAGG(
                JSON_OBJECT('photo_id', p.photo_id, 'mimetype', p.mimetype, 'filename', p.filename)
             ) FROM photos p WHERE p.report_id = r.report_id) AS photos
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