import { useState, useEffect } from 'react';
import { formatTime, getTimeCategory } from '../utils/dateUtils.js';
import { haversineDistance, kmToMiles } from '../utils/mapHelpers.js';

export default function CoursePopup({ course, date, teeTimesData, filters, userLocation, onClose }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [course.placeId]);

  const isLoading = !teeTimesData;
  const isAvailable = teeTimesData?.available;
  const teeTimes = teeTimesData?.teeTimes || [];

  const filteredTimes = teeTimes.filter((tt) => {
    if (tt.price < filters.priceMin || tt.price > filters.priceMax) return false;
    if (filters.timeOfDay.length > 0 && !filters.timeOfDay.includes(getTimeCategory(tt.time))) return false;
    if (tt.slots < filters.players) return false;
    if (filters.holes !== 'all' && tt.holes !== Number(filters.holes)) return false;
    return true;
  });

  const distanceMi = userLocation
    ? kmToMiles(haversineDistance(userLocation.lat, userLocation.lng, course.lat, course.lng))
    : null;

  const handleBook = (courseName) => {
    const query = encodeURIComponent(`${courseName} book tee time`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="fixed top-20 right-4 z-[1000] w-[360px] max-h-[calc(100vh-120px)] slide-in-left">
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/30 flex flex-col max-h-[calc(100vh-120px)]">
        <div className="relative">
          {course.photoRef && !imgError ? (
            <img
              src={`/api/course-photo?ref=${course.photoRef}&maxwidth=400`}
              alt={course.name}
              className="w-full h-40 object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-masters-green/30 to-charcoal-light flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-masters-green/50">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {isAvailable !== undefined && (
            <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isAvailable ? 'bg-masters-green text-white' : 'bg-soft-red text-white'
            }`}>
              {isAvailable ? `${filteredTimes.length} tee times` : 'Unavailable'}
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="font-display text-xl font-semibold leading-tight">{course.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white/50 text-sm leading-snug flex-1">{course.address}</p>
            {distanceMi !== null && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 text-xs font-medium">
                {distanceMi < 10 ? distanceMi.toFixed(1) : Math.round(distanceMi)} mi
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            {course.rating > 0 && (
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-semibold text-gold">{course.rating}</span>
                <span className="text-xs text-white/40">({course.totalRatings})</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="shimmer rounded-xl h-14" />
              ))}
            </div>
          ) : !isAvailable ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-soft-red/10 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-white/50 text-sm">No tee times available on this date</p>
              <p className="text-white/30 text-xs mt-1">Try another day</p>
            </div>
          ) : filteredTimes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/50 text-sm">No tee times match your filters</p>
              <p className="text-white/30 text-xs mt-1">Try adjusting price, time, holes, or player count</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTimes.map((tt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold w-20">{formatTime(tt.time)}</div>
                    <div className="text-masters-green font-semibold text-sm">${tt.price}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 font-medium">
                      {tt.holes}H
                    </span>
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          className={`w-2 h-2 rounded-full ${
                            j < tt.slots ? 'bg-masters-green/60' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBook(course.name)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-masters-green/20 text-masters-green-light opacity-0 group-hover:opacity-100 hover:bg-masters-green/30 transition-all"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full-width book button at bottom */}
        {isAvailable && filteredTimes.length > 0 && (
          <div className="p-4 pt-0">
            <button
              onClick={() => handleBook(course.name)}
              className="w-full py-3 rounded-xl bg-masters-green hover:bg-masters-green-light text-white font-semibold text-sm transition-colors shadow-lg shadow-masters-green/20"
            >
              Book at {course.name.length > 25 ? course.name.slice(0, 25) + '...' : course.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
