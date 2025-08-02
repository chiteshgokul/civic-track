const express = require('express');
const { initDatabase } = require('../config/database');
const logger = require('../utils/logger');
const router = express.Router();

/**
 * Gets photo data by photo_id
 * @param {express.Request} req - Request object
 * @param {express.Response} res - Response object
 */
const getPhotoData = async (req, res) => {
  try {
    const { photoId } = req.params;
    const pool = await initDatabase();
    const [photos] = await pool.query('SELECT data, mimetype FROM photos WHERE photo_id = ?', [photoId]);
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    const { data, mimetype } = photos[0];
    res.set('Content-Type', mimetype);
    res.send(data);
  } catch (error) {
    logger.error('Get photo data error:', error);
    res.status(500).json({ error: 'Failed to fetch photo data' });
  }
};

router.get('/:photoId/data', getPhotoData);

module.exports = router;