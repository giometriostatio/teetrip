# TeeTrip

An interactive map-first golf tee time discovery tool. Find available tee times at nearby courses, filter by price and time, and coordinate group outings with address triangulation.

## Features

- **Interactive Map** — Full-screen Leaflet map with OpenStreetMap tiles. Golf courses appear as green (available) or red (unavailable) markers based on the selected date.
- **Date Selector** — Step through days or pick a date from the calendar. Marker colors update dynamically.
- **Course Details** — Click any marker to see ratings, photos, and a scrollable list of tee times with pricing and slot availability.
- **Group Play / Address Triangulation** — Enter up to 4 player addresses, and TeeTrip calculates the best courses based on distance fairness, availability, and ratings.
- **Filters** — Price range, time of day, minimum rating, player count, and available-only toggle.
- **Simulated Tee Times** — Deterministic, realistic tee time generation seeded by course + date. Same inputs always produce the same availability.

## Tech Stack

- **Frontend:** Vite + React 18 + Tailwind CSS + Leaflet
- **Backend:** Node.js + Express (API proxy) / Vercel Serverless Functions
- **Data:** Google Places API (golf courses) + simulated tee times
- **Geocoding:** Nominatim / OpenStreetMap (free, no key needed)

## Setup

```bash
# 1. Clone and install
cd fairway-finder
npm install

# 2. Configure your Google Places API key
cp .env.example .env
# Edit .env and add your key: GOOGLE_PLACES_API_KEY=your_key_here

# 3. Run in development mode
npm run dev
```

The app runs at `http://localhost:5173` with the API server on port 3001.

### Getting a Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project (or select existing)
3. Enable the **Places API**
4. Create an API key under Credentials
5. Add the key to your `.env` file

## Production Build

```bash
npm run build   # Builds frontend to dist/
npm start       # Serves the built app via Express
```

## Vercel Deployment

This project is configured for Vercel out of the box:

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add your `GOOGLE_PLACES_API_KEY` as an environment variable
4. Deploy — Vercel builds the Vite frontend and deploys the `/api` directory as serverless functions

## Architecture

```
api/              Vercel serverless functions
  courses.js      GET /api/courses — proxies Google Places Nearby Search
  course-photo.js GET /api/course-photo — proxies Google Place Photos
  teetimes.js     GET /api/teetimes — returns simulated tee times
  teetimes-batch.js POST /api/teetimes-batch — batch tee time fetch
  health.js       GET /api/health — health check
  _utils/
    teetimeGenerator.js — deterministic pseudo-random tee time generation

server/           Express API server (local development)
  index.js        Dev server entry point
  routes/
    courses.js    Course & photo routes
    teetimes.js   Tee time routes

src/              React frontend
  components/     MapView, DateSelector, CoursePopup, GroupPanel, etc.
  hooks/          useCourses, useTeeTimes, useGeolocation, useGeocode
  utils/          triangulation, mapHelpers, dateUtils
```
