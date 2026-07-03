const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    budgetType: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    interests: {
      type: [String],
      required: true,
    },
    itinerary: [
      {
        day: Number,
        activities: [String],
      },
    ],
    budgetEstimate: {
      flights: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      total: Number,
    },
    hotelSuggestions: [
      {
        name: String,
        category: String,
        description: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for performance
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ userId: 1, _id: 1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ budgetType: 1 });

module.exports = mongoose.model('Trip', tripSchema);
