const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Gets flagged reports
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getFlaggedReports = async (req, res) => {
  try {
    const pool = await initDatabase();
    const [reports] = await pool.query(`
      SELECT r.report_id, r.title, COUNT(f.flag_id) AS flag_count
      FROM reports r
      JOIN flags f ON r.report_id = f.report_id
      GROUP BY r.report_id, r.title
      HAVING flag_count >= 3
    `);
    res.json(reports);
  } catch (error) {
    logger.error('Get flagged reports error:', error);
    res.status(500).json({ error: 'Failed to fetch flagged reports' });
  }
};

/**
 * Bans a user
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await initDatabase();
    await pool.query('UPDATE users SET is_admin = FALSE WHERE user_id = ?', [userId]);
    res.json({ message: 'User banned' });
  } catch (error) {
    logger.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

/**
 * Gets analytics for reports and complaints
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getAnalytics = async (req, res) => {
  try {
    const pool = await initDatabase();
    const [totalReports] = await pool.query('SELECT COUNT(*) AS count FROM reports');
    const [totalComplaints] = await pool.query('SELECT COUNT(*) AS count FROM complaints');
    const [categoryStats] = await pool.query(`
      SELECT c.name, COUNT(r.report_id) AS count
      FROM categories c
      LEFT JOIN reports r ON c.category_id = r.category_id
      GROUP BY c.name
    `);
    const [deptStats] = await pool.query(`
      SELECT d.dept_name, COUNT(c.complaint_id) AS count
      FROM departments d
      LEFT JOIN complaints c ON d.dept_id = c.dept_id
      GROUP BY d.dept_name
    `);
    res.json({
      totalReports: totalReports[0].count,
      totalComplaints: totalComplaints[0].count,
      categoryStats,
      deptStats,
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

module.exports = { getFlaggedReports, banUser, getAnalytics };