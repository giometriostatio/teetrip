import { useState, useEffect, useCallback, useRef } from 'react';
import MapView from './components/MapView.jsx';
import DateSelector from './components/DateSelector.jsx';
import CoursePopup from './components/CoursePopup.jsx';
import GroupPanel from './components/GroupPanel.jsx';
import FiltersPanel from './components/FiltersPanel.jsx';
import RecommendationCards from './components/RecommendationCards.jsx';
import { useGeolocation } from './hooks/useGeolocation.js';
import { useCourses } from './hooks/useCourses.js';
import { useTeeTimes } from './hooks/useTeeTimes.js';
import { todayString } from './utils/dateUtils.js';
import { boundsToParams } from './utils/mapHelpers.js';
import { DEBOUNCE_MS, MIN_SEARCH_ZOOM } from './constants.js';

export default function App() {
  const geo = useGeolocation();
  const { courses, loading: coursesLoading, error, fetchCourses, setError } = useCourses();
  const { teeTimesMap, loading: teeTimesLoading, fetchBatchTeeTimes } = useTeeTimes();

  const [selectedDate, setSelectedDate] = useState(todayString());
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [playerLocations, setPlayerLocations] = useState([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 200,
    timeOfDay: [],
    holes: 'all',
    minRating: 0,
    players: 1,
    availableOnly: false,
  });

  const mapRef = useRef(null);
  const debounceRef = useRef(null);
  const lastBoundsRef = useRef(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => {
        if (!d.hasApiKey) setApiKeyMissing(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      fetchBatchTeeTimes(courses, selectedDate);
    }
  }, [selectedDate, courses, fetchBatchTeeTimes]);

  const handleMapMove = useCallback(
    (bounds, zoom) => {
      if (zoom < MIN_SEARCH_ZOOM) return;
      const { lat, lng, radius } = boundsToParams(bounds);
      const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
      if (lastBoundsRef.current === key) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        lastBoundsRef.current = key;
        fetchCourses(lat, lng, radius);
      }, DEBOUNCE_MS);
    },
    [fetchCourses]
  );

  const handleCourseClick = useCallback((course) => {
    setSelectedCourse(course);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedCourse(null);
  }, []);

  const availableCount = courses.filter((c) => {
    const tt = teeTimesMap[c.placeId];
    return tt && tt.available;
  }).length;
  const unavailableCount = courses.filter((c) => {
    const tt = teeTimesMap[c.placeId];
    return tt && !tt.available;
  }).length;

  if (apiKeyMissing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-charcoal">
        <div className="glass-panel rounded-2xl p-10 max-w-lg text-center">
          <h1 className="font-display text-3xl text-gold mb-4">TeeTrip</h1>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-soft-red/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-3">API Key Required</h2>
          <p className="text-white/60 mb-6 leading-relaxed">
            TeeTrip needs a Google Places API key to find golf courses.
          </p>
          <div className="bg-charcoal-light rounded-xl p-4 text-left text-sm font-mono text-white/80 space-y-1">
            <p className="text-white/40"># 1. Copy the example env file</p>
            <p>cp .env.example .env</p>
            <p className="text-white/40 mt-2"># 2. Add your API key</p>
            <p>GOOGLE_PLACES_API_KEY=your_key</p>
            <p className="text-white/40 mt-2"># 3. Restart the server</p>
            <p>npm run dev</p>
          </div>
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-2.5 bg-masters-green rounded-lg font-medium hover:bg-masters-green-light transition-colors"
          >
            Get API Key →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <MapView
        ref={mapRef}
        center={[geo.lat, geo.lng]}
        zoom={geo.zoom}
        courses={courses}
        teeTimesMap={teeTimesMap}
        recommendations={recommendations}
        playerLocations={playerLocations}
        filters={filters}
        selectedDate={selectedDate}
        selectedCourseId={selectedCourse?.placeId || null}
        onMapMove={handleMapMove}
        onCourseClick={handleCourseClick}
      />

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        availableCount={availableCount}
        unavailableCount={unavailableCount}
        loading={coursesLoading || teeTimesLoading}
      />

      <GroupPanel
        courses={courses}
        teeTimesMap={teeTimesMap}
        selectedDate={selectedDate}
        filters={filters}
        mapRef={mapRef}
        onRecommendations={setRecommendations}
        onPlayerLocationsChange={setPlayerLocations}
      />

      <FiltersPanel filters={filters} onFiltersChange={setFilters} />

      {selectedCourse && (
        <CoursePopup
          course={selectedCourse}
          date={selectedDate}
          teeTimesData={teeTimesMap[selectedCourse.placeId]}
          filters={filters}
          userLocation={geo.located ? { lat: geo.lat, lng: geo.lng } : null}
          onClose={handleClosePopup}
        />
      )}

      {recommendations.length > 0 && (
        <RecommendationCards
          recommendations={recommendations}
          playerLocations={playerLocations}
          onCourseClick={handleCourseClick}
          onClose={() => setRecommendations([])}
        />
      )}

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] fade-in">
          <div className="glass-panel rounded-xl px-5 py-3 flex items-center gap-3 border-soft-red/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-white/40 hover:text-white ml-2">✕</button>
          </div>
        </div>
      )}

      {coursesLoading && (
        <div className="fixed bottom-6 right-6 z-[1100]">
          <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-masters-green border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white/60">Loading courses…</span>
          </div>
        </div>
      )}
    </div>
  );
}
