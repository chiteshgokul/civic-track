const express = require('express');
const { createCitizen, getCitizens } = require('../controllers/citizenController');
const { authenticate, restrictToAdmin } = require('../middleware/auth');
const { validateCitizen } = require('../middleware/validation');
const router = express.Router();

router.post('/', validateCitizen, createCitizen);
router.get('/', authenticate, restrictToAdmin, getCitizens);

module.exports = router;