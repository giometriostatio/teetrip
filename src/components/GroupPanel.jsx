import { useState, useCallback } from 'react';
import { useGeocode } from '../hooks/useGeocode.js';
import { useTeeTimes } from '../hooks/useTeeTimes.js';
import { getCentroid, scoreCourses, buildExplanation } from '../utils/triangulation.js';
import { PLAYER_LABELS, PLAYER_COLORS } from '../constants.js';

export default function GroupPanel({
  courses,
  teeTimesMap,
  selectedDate,
  filters,
  mapRef,
  onRecommendations,
  onPlayerLocationsChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState(['', '', '', '']);
  const [locations, setLocations] = useState([null, null, null, null]);
  const [geocoding, setGeocoding] = useState([false, false, false, false]);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState(null);
  const { geocode } = useGeocode();
  const { fetchBatchTeeTimes } = useTeeTimes();

  const handleAddressChange = (index, value) => {
    const next = [...addresses];
    next[index] = value;
    setAddresses(next);
  };

  const handleGeocode = useCallback(
    async (index) => {
      if (!addresses[index] || addresses[index].trim().length < 3) return;

      const next = [...geocoding];
      next[index] = true;
      setGeocoding(next);

      const result = await geocode(addresses[index]);

      const nextG = [...geocoding];
      nextG[index] = false;
      setGeocoding(nextG);

      const nextLocs = [...locations];
      nextLocs[index] = result;
      setLocations(nextLocs);
      onPlayerLocationsChange(nextLocs.filter(Boolean));

      if (!result) {
        setError(`Could not find address for ${PLAYER_LABELS[index]}`);
        setTimeout(() => setError(null), 3000);
      }
    },
    [addresses, geocode, geocoding, locations, onPlayerLocationsChange]
  );

  const handleFind = useCallback(async () => {
    const validLocs = locations.filter(Boolean);
    if (validLocs.length < 1) {
      setError('Enter at least one address first');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setFinding(true);
    setError(null);

    try {
      const centroid = getCentroid(validLocs);
      if (!centroid) {
        setFinding(false);
        return;
      }

      // Always fetch courses near the centroid from the API with expanding radius
      let nearbyCourses = [];
      const radii = [15000, 30000, 50000];
      for (const radius of radii) {
        const res = await fetch(
          `/api/courses?lat=${centroid.lat}&lng=${centroid.lng}&radius=${radius}`
        );
        const data = await res.json();
        if (res.ok && data.courses) {
          // Merge without duplicates
          const existingIds = new Set(nearbyCourses.map((c) => c.placeId));
          const newCourses = data.courses.filter((c) => !existingIds.has(c.placeId));
          nearbyCourses = [...nearbyCourses, ...newCourses];
        }
        if (nearbyCourses.length >= 10) break;
      }

      if (nearbyCourses.length === 0) {
        setError('No courses found between your group. Try adjusting player locations or expanding the search.');
        setFinding(false);
        return;
      }

      // Fetch tee times for all found courses
      let ttMap = { ...teeTimesMap };
      const missing = nearbyCourses.filter((c) => !ttMap[c.placeId]);
      if (missing.length > 0) {
        const batchResult = await fetchBatchTeeTimes(missing, selectedDate);
        ttMap = { ...ttMap, ...batchResult };
      }

      const playerCount = validLocs.length;
      const scored = scoreCourses(nearbyCourses, validLocs, ttMap, playerCount, filters);

      const withExplanations = scored.map((r) => ({
        ...r,
        explanation: buildExplanation(r, playerCount),
      }));

      onRecommendations(withExplanations);

      if (withExplanations.length > 0) {
        const allPoints = [
          ...validLocs,
          ...withExplanations.map((r) => ({ lat: r.lat, lng: r.lng })),
        ];
        const bounds = allPoints.map((p) => [p.lat, p.lng]);
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
        }
      }
    } catch (err) {
      setError('Failed to find courses — try again');
    } finally {
      setFinding(false);
    }
  }, [
    locations, teeTimesMap, selectedDate, filters, fetchBatchTeeTimes,
    onRecommendations, mapRef,
  ]);

  const validCount = locations.filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-[1000] glass-panel rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors shadow-lg shadow-black/20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Find Your Fairway</span>
        {isOpen && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-32 left-4 z-[1000] w-80 slide-in-left">
          <div className="glass-panel rounded-2xl p-5 shadow-2xl shadow-black/30 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin">
            <h3 className="font-display text-lg font-semibold text-gold mb-1">Find Your Fairway</h3>
            <p className="text-white/40 text-xs mb-4">
              Enter addresses to find the best course for your group
            </p>

            <div className="space-y-3">
              {PLAYER_LABELS.map((label, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PLAYER_COLORS[i] }}
                    />
                    <label className="text-xs text-white/50">{label}</label>
                    {locations[i] && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006747" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={addresses[i]}
                      onChange={(e) => handleAddressChange(i, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGeocode(i)}
                      placeholder="Enter city or address…"
                      className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-white/20 focus:outline-none focus:border-masters-green/50 transition-colors"
                    />
                    <button
                      onClick={() => handleGeocode(i)}
                      disabled={geocoding[i] || !addresses[i]}
                      className="px-2.5 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-30"
                    >
                      {geocoding[i] ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"/>
                          <path d="M21 21l-4.35-4.35"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-3 text-xs text-soft-red bg-soft-red/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleFind}
              disabled={finding || validCount < 1}
              className="w-full mt-4 py-2.5 rounded-xl bg-masters-green font-semibold text-sm hover:bg-masters-green-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {finding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finding courses…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  Find Best Courses
                  {validCount > 0 && (
                    <span className="text-xs opacity-60">({validCount} player{validCount !== 1 ? 's' : ''})</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
