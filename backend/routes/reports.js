const express = require('express');
const { createReport, getReports, updateStatus } = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { validateReport, validateReportQuery } = require('../middleware/validation');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 35 } });

router.post('/', authenticate, upload.array('photos', 35), validateReport, createReport);
router.get('/', validateReportQuery, getReports);
router.put('/:reportId/status', authenticate, updateStatus);

module.exports = router;