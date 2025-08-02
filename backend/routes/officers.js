const express = require('express');
const { createOfficer, getOfficers } = require('../controllers/officerController');
const { authenticate, restrictToAdmin } = require('../middleware/auth');
const { validateOfficer } = require('../middleware/validation');
const router = express.Router();

router.post('/', authenticate, restrictToAdmin, validateOfficer, createOfficer);
router.get('/', authenticate, restrictToAdmin, getOfficers);

module.exports = router;