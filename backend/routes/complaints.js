const express = require('express');
const { createComplaint, updateComplaintStatus, getComplaints } = require('../controllers/complaintController');
const { authenticate, restrictToAdmin } = require('../middleware/auth');
const { validateComplaint } = require('../middleware/validation');
const router = express.Router();

router.post('/', validateComplaint, createComplaint);
router.put('/:complaintId/status', authenticate, restrictToAdmin, updateComplaintStatus);
router.get('/', authenticate, restrictToAdmin, getComplaints);

module.exports = router;