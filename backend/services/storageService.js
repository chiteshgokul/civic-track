const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Saves a photo to the MySQL database
 * @param {Object} file - File object from multer
 * @param {number} reportId - Associated report ID
 * @returns {Promise<number>} Photo ID
 */
const savePhoto = async (file, reportId) => {
  try {
    if (!file || !reportId) throw new Error('File or reportId missing');
    const pool = await initDatabase();
    const [result] = await pool.query(
      'INSERT INTO photos (report_id, data, mimetype, filename) VALUES (?, ?, ?, ?)',
      [reportId, file.buffer, file.mimetype, file.originalname]
    );
    logger.info(`Photo saved to database: ${file.originalname}`);
    return result.insertId;
  } catch (error) {
    logger.error('Database photo save error:', error);
    throw error;
  }
};

module.exports = { savePhoto };