require('dotenv').config();

/**
 * Environment configuration
 */
const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;