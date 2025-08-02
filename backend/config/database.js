 const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

/**
 * Initializes MySQL database connection
 * @returns {Promise<mysql.Pool>} Database connection pool
 */
const initDatabase = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    logger.info('Database connection established');
    return pool;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = { initDatabase };