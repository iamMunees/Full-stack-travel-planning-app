# Trip Planner - AI-Powered Multi-User Travel Application

A comprehensive full-stack web application that enables users to plan personalized trips with AI-generated itineraries, budget estimates, and hotel recommendations.

## 🎯 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Trip Planning**: Create and manage multiple trips
- **AI-Generated Itineraries**: Day-by-day activities based on user interests
- **Budget Estimation**: Realistic cost breakdown for flights, accommodation, food, and activities
- **Hotel Suggestions**: AI-recommended hotels based on destination and budget
- **Editable Itineraries**: Modify activities and regenerate specific days
- **Data Isolation**: Strict user-level data separation and authorization

## 🏗️ Project Structure

```
trip-planner/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & error handling
│   │   ├── services/          # AI & business logic
│   │   ├── config/            # Database configuration
│   │   └── index.js           # Server entry point
│   └── package.json
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # Next.js pages & layout
│   │   ├── components/        # Reusable React components
│   │   └── utils/             # API & auth utilities
│   ├── tailwind.config.js
│   └── package.json
├── package.json               # Root workspace config
└── .env.example              # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB installed locally or Atlas connection string
- OpenAI API key for LLM features

### Installation

1. **Clone and navigate to project**
   ```bash
   cd trip-planner
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install backend dependencies**
   ```bash
   npm install --workspace=backend
   ```

5. **Install frontend dependencies**
   ```bash
   npm install --workspace=frontend
   ```

### Development

**Run both frontend and backend**
```bash
npm run dev
```

**Or run separately**
```bash
npm run backend:dev    # Terminal 1
npm run frontend:dev   # Terminal 2
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:tripId` - Get trip details
- `POST /api/trips/:tripId/generate` - Generate itinerary, budget, and hotels
- `PUT /api/trips/:tripId/itinerary` - Update specific day activities
- `DELETE /api/trips/:tripId` - Delete a trip

## 🔐 Security Features

- JWT-based authentication with 7-day expiration
- Password hashing with bcryptjs
- Request authorization middleware
- User data isolation at database level
- Protected API routes

## 📦 Tech Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Axios
- js-cookie

**Backend:**
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- OpenAI API
- bcryptjs

## 🔧 Configuration

### Environment Variables

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/trip-planner
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Development Workflow

1. **Backend changes**: Nodemon watches for file changes and auto-restarts
2. **Frontend changes**: Next.js hot-reloads automatically
3. **Database**: MongoDB schemas defined in `/backend/src/models/`
4. **Components**: Reusable components in `/frontend/src/components/`

## 🎨 UI/UX Features

- Responsive design with Tailwind CSS
- Clean navigation and intuitive forms
- Real-time trip management
- Loading states and error handling
- Accessibility considerations

## 🚧 Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Update environment variables for production

3. Deploy frontend to Vercel/Netlify
   ```bash
   npm run build --workspace=frontend
   ```

4. Deploy backend to Heroku/Railway/Render
   ```bash
   npm start --workspace=backend
   ```

## 📚 Additional Notes

- All user trips are isolated by `userId`
- AI responses are cached in the database
- Budget estimates based on real travel data
- Hotel suggestions include multiple price categories

## 📧 Support

For issues or questions, please check:
- Backend logs: `backend/src/` controllers and services
- Frontend console: Browser DevTools
- Database: MongoDB Atlas

---

**Happy trip planning! 🌍✈️**
