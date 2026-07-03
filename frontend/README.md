# Trip Planner Frontend

Next.js-based user interface for the AI Trip Planner application.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Project Structure

- `/src/app/` - Next.js pages and layouts
- `/src/components/` - Reusable React components
- `/src/utils/` - API client and authentication helpers
- `/public/` - Static assets

## Pages

- `/` - Landing page
- `/register` - User registration
- `/login` - User login
- `/dashboard` - Main application (protected)

## Components

- `Navbar` - Navigation header with logout
- `TripForm` - Form to create new trips
- `ItineraryDisplay` - Shows and allows editing of trip itinerary
- `BudgetEstimate` - Displays budget breakdown
- `HotelSuggestions` - Shows hotel recommendations
- `ProtectedRoute` - Wrapper for authenticated pages

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Key Features

- User authentication with JWT
- Trip management (create, read, update, delete)
- AI-generated itineraries
- Budget estimation
- Hotel recommendations
- Responsive design with Tailwind CSS
