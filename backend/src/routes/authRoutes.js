const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const handleValidationErrors = require('../middleware/validationHandler');

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must contain letters and numbers'),
  ],
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password is required'),
  ],
  handleValidationErrors,
  authController.login
);

module.exports = router;
