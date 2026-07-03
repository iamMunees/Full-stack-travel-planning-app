const { GoogleGenAI } = require('@google/genai');
const AppError = require('../utils/appError');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

const apiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.google_api_key;

if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not configured');
}

const ai = new GoogleGenAI({ apiKey });
const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

const generateJson = async ({ prompt, schema, maxOutputTokens }) => {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens,
      responseMimeType: 'application/json',
      responseJsonSchema: schema,
    },
  });

  if (!response.text) {
    throw new Error('Gemini returned an empty response');
  }

  return JSON.parse(response.text);
};

const throwGeminiError = (operation, error) => {
  logger.error(`Error ${operation} with Gemini: ${error.message}`);

  const status = error.status || error.statusCode || error.code;
  if (status === 429) {
    throw new AppError('Gemini API rate limit exceeded. Please try again later.', 429);
  }
  if (status === 401 || status === 403 || /api key/i.test(error.message)) {
    throw new AppError('Gemini API key is invalid or unauthorized', 500);
  }

  throw new AppError(`Failed to ${operation}`, 500);
};

const generateItinerary = async (trip) => {
  try {
    const cacheKey = `itinerary_${trip.destination}_${trip.numberOfDays}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info(`Returning cached itinerary for ${trip.destination}`);
      return cached;
    }

    logger.info(`Generating itinerary for ${trip.destination} with Gemini`);
    const itinerary = await generateJson({
      prompt: `Create a detailed ${trip.numberOfDays}-day itinerary for ${trip.destination} based on these interests: ${trip.interests.join(', ')}. Include 3-4 concise activities per day.`,
      maxOutputTokens: 4000,
      schema: {
        type: 'array',
        minItems: trip.numberOfDays,
        maxItems: trip.numberOfDays,
        items: {
          type: 'object',
          required: ['day', 'activities'],
          properties: {
            day: { type: 'integer' },
            activities: {
              type: 'array',
              minItems: 3,
              maxItems: 4,
              items: { type: 'string' },
            },
          },
        },
      },
    });

    cache.set(cacheKey, itinerary, 24 * 60 * 60 * 1000);
    return itinerary;
  } catch (error) {
    throwGeminiError('generate itinerary', error);
  }
};

const estimateBudget = async (trip) => {
  try {
    const cacheKey = `budget_${trip.destination}_${trip.budgetType}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info(`Returning cached budget for ${trip.destination}`);
      return cached;
    }

    logger.info(`Estimating budget for ${trip.destination} with Gemini`);
    const budget = await generateJson({
      prompt: `Estimate a realistic ${trip.budgetType.toLowerCase()} budget in USD for a ${trip.numberOfDays}-day trip to ${trip.destination}. Return whole-number estimates for flights, accommodation, food, activities, and their total.`,
      maxOutputTokens: 500,
      schema: {
        type: 'object',
        required: ['flights', 'accommodation', 'food', 'activities', 'total'],
        properties: {
          flights: { type: 'integer', minimum: 0 },
          accommodation: { type: 'integer', minimum: 0 },
          food: { type: 'integer', minimum: 0 },
          activities: { type: 'integer', minimum: 0 },
          total: { type: 'integer', minimum: 0 },
        },
      },
    });

    cache.set(cacheKey, budget, 24 * 60 * 60 * 1000);
    return budget;
  } catch (error) {
    throwGeminiError('estimate budget', error);
  }
};

const suggestHotels = async (trip) => {
  try {
    const cacheKey = `hotels_${trip.destination}_${trip.budgetType}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info(`Returning cached hotels for ${trip.destination}`);
      return cached;
    }

    logger.info(`Suggesting hotels for ${trip.destination} with Gemini`);
    const hotels = await generateJson({
      prompt: `Suggest 3 plausible hotels in ${trip.destination} for a ${trip.budgetType.toLowerCase()} budget traveler. Give each hotel's name, category, and a brief description.`,
      maxOutputTokens: 800,
      schema: {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'object',
          required: ['name', 'category', 'description'],
          properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    });

    cache.set(cacheKey, hotels, 24 * 60 * 60 * 1000);
    return hotels;
  } catch (error) {
    throwGeminiError('suggest hotels', error);
  }
};

module.exports = {
  generateItinerary,
  estimateBudget,
  suggestHotels,
};
