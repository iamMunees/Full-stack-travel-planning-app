const express = require('express');
const { body, param } = require('express-validator');
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');
const handleValidationErrors = require('../middleware/validationHandler');

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.post(
  '/',
  [
    body('destination')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Destination must be between 2 and 100 characters'),
    body('numberOfDays')
      .isInt({ min: 1, max: 90 })
      .withMessage('Number of days must be between 1 and 90'),
    body('budgetType')
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Budget type must be Low, Medium, or High'),
    body('interests')
      .isArray({ min: 1, max: 6 })
      .withMessage('Select between 1 and 6 interests'),
  ],
  handleValidationErrors,
  tripController.createTrip
);

router.get('/', tripController.getTrips);

router.get(
  '/:tripId',
  param('tripId').isMongoId().withMessage('Invalid trip ID'),
  handleValidationErrors,
  tripController.getTripById
);

router.post(
  '/:tripId/generate',
  param('tripId').isMongoId().withMessage('Invalid trip ID'),
  handleValidationErrors,
  tripController.generateTripItinerary
);

router.put(
  '/:tripId/itinerary',
  [
    param('tripId').isMongoId().withMessage('Invalid trip ID'),
    body('day').isInt({ min: 1, max: 90 }).withMessage('Day must be between 1 and 90'),
    body('activities')
      .isArray({ min: 1, max: 10 })
      .withMessage('Provide between 1 and 10 activities'),
  ],
  handleValidationErrors,
  tripController.updateItinerary
);

router.delete(
  '/:tripId',
  param('tripId').isMongoId().withMessage('Invalid trip ID'),
  handleValidationErrors,
  tripController.deleteTrip
);

module.exports = router;
