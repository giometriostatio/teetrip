# FairwayFinder

An interactive map-first golf tee time discovery tool. Find available tee times at nearby courses, filter by price and time, and coordinate group outings with address triangulation.

## Features

- **Interactive Map** — Full-screen Leaflet map with OpenStreetMap tiles. Golf courses appear as green (available) or red (unavailable) markers based on the selected date.
- **Date Selector** — Step through days or pick a date from the calendar. Marker colors update dynamically.
- **Course Details** — Click any marker to see ratings, photos, and a scrollable list of tee times with pricing and slot availability.
- **Group Play / Address Triangulation** — Enter up to 4 player addresses, and FairwayFinder calculates the best courses based on distance fairness, availability, and ratings.
- **Filters** — Price range, time of day, minimum rating, player count, and available-only toggle.
- **Simulated Tee Times** — Deterministic, realistic tee time generation seeded by course + date. Same inputs always produce the same availability.

## Tech Stack

- **Frontend:** Vite + React 18 + Tailwind CSS + Leaflet
- **Backend:** Node.js + Express (API proxy)
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

## Architecture

```
server/           Express API proxy (keeps Google API key server-side)
  routes/
    courses.js    GET /api/courses — proxies Google Places Nearby Search
    teetimes.js   GET /api/teetimes — returns simulated tee times
  utils/
    teetimeGenerator.js — deterministic pseudo-random tee time generation

src/              React frontend
  components/     MapView, DateSelector, CoursePopup, GroupPanel, etc.
  hooks/          useCourses, useTeeTimes, useGeolocation, useGeocode
  utils/          triangulation, mapHelpers, dateUtils
```
