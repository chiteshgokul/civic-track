const { body, query, validationResult } = require('express-validator');

/**
 * Validates report creation
 */
const validateReport = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('categoryId').isInt().withMessage('Valid category ID required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates report query
 */
const validateReportQuery = [
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('radius').optional().isInt({ min: 1000, max: 5000 }).withMessage('Radius must be between 1000 and 5000 meters'),
  query('status').optional().isIn(['Reported', 'In Progress', 'Resolved']).withMessage('Invalid status'),
  query('categoryId').optional().isInt().withMessage('Valid category ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates citizen creation
 */
const validateCitizen = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('aadhar_no').optional().isLength({ min: 12, max: 12 }).withMessage('Aadhar number must be 12 digits'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates department creation
 */
const validateDepartment = [
  body('dept_name').trim().notEmpty().withMessage('Department name is required'),
  body('contact_no').optional().isMobilePhone().withMessage('Valid contact number required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates officer creation
 */
const validateOfficer = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('designation').optional().trim().notEmpty().withMessage('Designation is required if provided'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('dept_id').isInt().withMessage('Valid department ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates complaint creation
 */
const validateComplaint = [
  body('citizen_id').isInt().withMessage('Valid citizen ID required'),
  body('dept_id').isInt().withMessage('Valid department ID required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateReport,
  validateReportQuery,
  validateCitizen,
  validateDepartment,
  validateOfficer,
  validateComplaint
};