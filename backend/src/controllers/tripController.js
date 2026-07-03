const Trip = require('../models/Trip');
const { generateItinerary, estimateBudget, suggestHotels } = require('../services/aiService');
const AppError = require('../utils/appError');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

exports.createTrip = async (req, res, next) => {
  try {
    const { destination, numberOfDays, budgetType, interests } = req.body;
    const userId = req.userId;

    logger.info(`Creating trip for user ${userId}: ${destination}`);

    // Create trip
    const trip = new Trip({
      userId,
      destination,
      numberOfDays,
      budgetType,
      interests,
      itinerary: [],
      budgetEstimate: {},
      hotelSuggestions: [],
    });

    await trip.save();

    // Clear user trips cache
    cache.delete(`trips_${userId}`);

    logger.info(`Trip created successfully: ${trip._id}`);

    res.status(201).json({
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    logger.error(`Error creating trip: ${error.message}`);
    next(error);
  }
};

exports.getTrips = async (req, res, next) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `trips_${userId}_${page}_${limit}`;
    const cachedTrips = cache.get(cacheKey);

    if (cachedTrips) {
      logger.info(`Returning cached trips for user ${userId}`);
      return res.status(200).json(cachedTrips);
    }

    const total = await Trip.countDocuments({ userId });
    const trips = await Trip.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const response = {
      trips,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };

    // Cache for 5 minutes
    cache.set(cacheKey, response, 5 * 60 * 1000);

    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error fetching trips: ${error.message}`);
    next(error);
  }
};

exports.getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;

    const cacheKey = `trip_${tripId}`;
    const cachedTrip = cache.get(cacheKey);

    if (cachedTrip) {
      return res.status(200).json({ trip: cachedTrip });
    }

    const trip = await Trip.findOne({ _id: tripId, userId });

    if (!trip) {
      logger.warn(`Trip not found or unauthorized: ${tripId} for user ${userId}`);
      return next(new AppError('Trip not found', 404));
    }

    cache.set(cacheKey, trip);

    res.status(200).json({ trip });
  } catch (error) {
    logger.error(`Error fetching trip: ${error.message}`);
    next(error);
  }
};

exports.generateTripItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;

    const trip = await Trip.findOne({ _id: tripId, userId });

    if (!trip) {
      logger.warn(`Trip not found for generation: ${tripId}`);
      return next(new AppError('Trip not found', 404));
    }

    logger.info(`Generating itinerary for trip ${tripId}`);

    // Generate itinerary using AI
    const itinerary = await generateItinerary(trip);
    trip.itinerary = itinerary;

    // Estimate budget
    const budgetEstimate = await estimateBudget(trip);
    trip.budgetEstimate = budgetEstimate;

    // Suggest hotels
    const hotelSuggestions = await suggestHotels(trip);
    trip.hotelSuggestions = hotelSuggestions;

    await trip.save();

    // Clear caches
    cache.delete(`trip_${tripId}`);
    cache.delete(`trips_${userId}_*`);

    logger.info(`Itinerary generated successfully for trip ${tripId}`);

    res.status(200).json({
      message: 'Trip itinerary generated successfully',
      trip,
    });
  } catch (error) {
    logger.error(`Error generating itinerary: ${error.message}`);
    next(error);
  }
};

exports.updateItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { day, activities } = req.body;
    const userId = req.userId;

    const trip = await Trip.findOne({ _id: tripId, userId });

    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Update or create day in itinerary
    const dayIndex = trip.itinerary.findIndex(d => d.day === day);
    if (dayIndex >= 0) {
      trip.itinerary[dayIndex].activities = activities;
    } else {
      trip.itinerary.push({ day, activities });
    }

    // Sort itinerary by day
    trip.itinerary.sort((a, b) => a.day - b.day);

    await trip.save();

    // Clear cache
    cache.delete(`trip_${tripId}`);

    logger.info(`Itinerary updated for trip ${tripId}, day ${day}`);

    res.status(200).json({
      message: 'Itinerary updated successfully',
      trip,
    });
  } catch (error) {
    logger.error(`Error updating itinerary: ${error.message}`);
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const userId = req.userId;

    const trip = await Trip.findOneAndDelete({ _id: tripId, userId });

    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }

    // Clear caches
    cache.delete(`trip_${tripId}`);
    cache.delete(`trips_${userId}_*`);

    logger.info(`Trip deleted successfully: ${tripId}`);

    res.status(200).json({
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting trip: ${error.message}`);
    next(error);
  }
};
