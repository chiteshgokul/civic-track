const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDatabase } = require('../config/database');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Registers a new user
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const register = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const pool = await initDatabase();

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, isAdmin || false]
    );

    res.status(201).json({ userId: result.insertId });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Logs in a user
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Changed from username to email
    const pool = await initDatabase();

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]); // Query by email
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id, isAdmin: user.is_admin }, config.jwtSecret, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Verifies the JWT token
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const verifyToken = async (req, res) => {
  try {
    res.status(200).json({ message: 'Token is valid', user: req.user });
  } catch (error) {
    logger.error('Verify token error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { register, login, verifyToken };