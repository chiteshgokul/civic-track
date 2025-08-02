const express = require('express');
const { createDepartment, getDepartments } = require('../controllers/departmentController');
const { authenticate, restrictToAdmin } = require('../middleware/auth');
const { validateDepartment } = require('../middleware/validation');
const router = express.Router();

router.post('/', authenticate, restrictToAdmin, validateDepartment, createDepartment);
router.get('/', getDepartments);

module.exports = router;