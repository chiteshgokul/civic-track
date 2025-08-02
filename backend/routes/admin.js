const express = require('express');
const { getFlaggedReports, banUser, getAnalytics } = require('../controllers/adminController');
const { authenticate, restrictToAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/flagged', authenticate, restrictToAdmin, getFlaggedReports);
router.put('/users/:userId/ban', authenticate, restrictToAdmin, banUser);
router.get('/analytics', authenticate, restrictToAdmin, getAnalytics);

module.exports = router;