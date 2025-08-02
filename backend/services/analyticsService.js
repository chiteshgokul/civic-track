const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Gets analytics for reports and complaints
 * @returns {Promise<Object>} Analytics data
 */
const getAnalytics = async () => {
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
    return {
      totalReports: totalReports[0].count,
      totalComplaints: totalComplaints[0].count,
      categoryStats,
      deptStats,
    };
  } catch (error) {
    logger.error('Analytics error:', error);
    throw error;
  }
};

module.exports = { getAnalytics };