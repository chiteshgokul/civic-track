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
    const { username, email, password } = req.body;
    const pool = await initDatabase();
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Logs in a user and returns a JWT
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await initDatabase();
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.user_id, isAdmin: user.is_admin }, config.jwtSecret, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };