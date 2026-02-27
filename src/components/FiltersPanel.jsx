import { useState, useRef, useCallback, useEffect } from 'react';

function DualRangeSlider({ min, max, valueMin, valueMax, onChange }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(null);

  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  const getValueFromEvent = useCallback(
    (e) => {
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(pct * (max - min) + min);
    },
    [min, max]
  );

  const handlePointerDown = useCallback(
    (handle) => (e) => {
      e.preventDefault();
      draggingRef.current = handle;
    },
    []
  );

  useEffect(() => {
    const handleMove = (e) => {
      if (!draggingRef.current) return;
      const val = getValueFromEvent(e);
      if (draggingRef.current === 'min') {
        onChange(Math.min(val, valueMax - 5), valueMax);
      } else {
        onChange(valueMin, Math.max(val, valueMin + 5));
      }
    };
    const handleUp = () => {
      draggingRef.current = null;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [getValueFromEvent, onChange, valueMin, valueMax]);

  return (
    <div className="pt-2 pb-1">
      <div ref={trackRef} className="relative h-1.5 bg-white/10 rounded-full cursor-pointer">
        <div
          className="absolute h-full bg-masters-green rounded-full"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        <div
          className="absolute w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/4 cursor-grab shadow-md hover:scale-110 transition-transform"
          style={{ left: `${pctMin}%` }}
          onMouseDown={handlePointerDown('min')}
          onTouchStart={handlePointerDown('min')}
        />
        <div
          className="absolute w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/4 cursor-grab shadow-md hover:scale-110 transition-transform"
          style={{ left: `${pctMax}%` }}
          onMouseDown={handlePointerDown('max')}
          onTouchStart={handlePointerDown('max')}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm font-semibold text-masters-green-light">
        <span>${valueMin}</span>
        <span className="text-white/30">—</span>
        <span>${valueMax}</span>
      </div>
    </div>
  );
}

const TIME_OPTIONS = [
  { value: 'earlybird', label: 'Early Bird', desc: '< 8 AM' },
  { value: 'morning', label: 'Morning', desc: '8-11 AM' },
  { value: 'midday', label: 'Midday', desc: '11-2 PM' },
  { value: 'afternoon', label: 'Afternoon', desc: '2-5 PM' },
];

export default function FiltersPanel({ filters, onFiltersChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleTimeOfDay = (value) => {
    const current = filters.timeOfDay;
    if (current.includes(value)) {
      update('timeOfDay', current.filter((v) => v !== value));
    } else {
      update('timeOfDay', [...current, value]);
    }
  };

  const activeFilterCount = [
    filters.priceMin > 0 || filters.priceMax < 200,
    filters.timeOfDay.length > 0,
    filters.holes !== 'all',
    filters.minRating > 0,
    filters.availableOnly,
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-[1000] glass-panel rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors shadow-lg shadow-black/20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="21" x2="4" y2="14"/>
          <line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/>
          <line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-masters-green text-white text-[10px] font-bold flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-32 right-4 z-[1000] w-80 slide-in-left">
          <div className="glass-panel rounded-2xl p-5 shadow-2xl shadow-black/30">
            <h3 className="font-display text-lg font-semibold mb-4">Filters</h3>

            <div className="space-y-5">
              {/* Holes Filter */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">
                  Holes
                </label>
                <div className="flex gap-1.5">
                  {[
                    { value: 'all', label: 'All' },
                    { value: '9', label: '9 Holes' },
                    { value: '18', label: '18 Holes' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => update('holes', opt.value)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        filters.holes === opt.value
                          ? 'bg-masters-green text-white'
                          : 'bg-white/[0.05] text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day - Multi-select chips */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">
                  Time of Day
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_OPTIONS.map((opt) => {
                    const isActive = filters.timeOfDay.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleTimeOfDay(opt.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-masters-green text-white'
                            : 'bg-white/[0.05] text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {opt.label}
                        <span className="text-[10px] ml-1 opacity-60">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {filters.timeOfDay.length === 0 && (
                  <p className="text-[10px] text-white/30 mt-1">All times shown</p>
                )}
              </div>

              {/* Price Range - Dual handle slider */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                  Price Range
                </label>
                <DualRangeSlider
                  min={0}
                  max={200}
                  valueMin={filters.priceMin}
                  valueMax={filters.priceMax}
                  onChange={(newMin, newMax) => {
                    onFiltersChange({ ...filters, priceMin: newMin, priceMax: newMax });
                  }}
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">
                  Minimum Rating
                </label>
                <div className="flex gap-1">
                  {[0, 3, 3.5, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => update('minRating', r)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-0.5 ${
                        filters.minRating === r
                          ? 'bg-gold/20 text-gold'
                          : 'bg-white/[0.05] text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {r === 0 ? 'Any' : (
                        <>
                          {r}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Players */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">
                  Players
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => update('players', n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filters.players === n
                          ? 'bg-masters-green text-white'
                          : 'bg-white/[0.05] text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Only */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/50 uppercase tracking-wider">
                  Available Only
                </label>
                <button
                  onClick={() => update('availableOnly', !filters.availableOnly)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    filters.availableOnly ? 'bg-masters-green' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                      filters.availableOnly ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
