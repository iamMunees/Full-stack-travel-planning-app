# Trip Planner Backend

Express.js REST API for the AI Trip Planner application.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on http://localhost:5000

## Build

Production is Node.js (no build step needed)

```bash
npm start
```

## Project Structure

- `/src/index.js` - Server entry point
- `/src/config/` - Database configuration
- `/src/models/` - MongoDB schemas
- `/src/controllers/` - Route handlers
- `/src/routes/` - API route definitions
- `/src/middleware/` - Auth & error handling
- `/src/services/` - Business logic & AI integration
- `/src/utils/` - Helper functions

## Models

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- timestamps

### Trip
- userId (ObjectId, ref: User)
- destination (String)
- numberOfDays (Number)
- budgetType (String: Low/Medium/High)
- interests (Array)
- itinerary (Array of {day, activities})
- budgetEstimate (Object)
- hotelSuggestions (Array)
- timestamps

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/trip-planner
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_key
```

## API Routes

See [BACKEND_API.md](../BACKEND_API.md) for complete API documentation

### Auth Routes
- POST `/api/auth/register`
- POST `/api/auth/login`

### Trip Routes (all protected)
- POST `/api/trips`
- GET `/api/trips`
- GET `/api/trips/:tripId`
- POST `/api/trips/:tripId/generate`
- PUT `/api/trips/:tripId/itinerary`
- DELETE `/api/trips/:tripId`

## Key Features

- JWT authentication with password hashing
- MongoDB integration with Mongoose
- OpenAI API for AI features
- User-level data isolation
- Error handling middleware
- Authorization middleware

## Security

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens expire after 7 days
- All sensitive data in .env file
- User data strictly isolated by userId

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- openai: AI integration
- cors: Cross-origin support
- dotenv: Environment variables
- express-validator: Input validation
