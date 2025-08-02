const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Gets reports within a radius
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {number} radius - Radius in meters
 * @returns {Promise<Array>} Reports within radius
 */
const getReportsInRadius = async (latitude, longitude, radius) => {
  try {
    const pool = await initDatabase();
    const [reports] = await pool.query(
      `SELECT report_id, title, status, ST_X(location) AS latitude, ST_Y(location) AS longitude
       FROM reports
       WHERE ST_Distance_Sphere(location, ST_GeomFromText('POINT(? ?)', 4326)) <= ?`,
      [latitude, longitude, radius]
    );
    return reports;
  } catch (error) {
    logger.error('Geo query error:', error);
    throw error;
  }
};

module.exports = { getReportsInRadius };