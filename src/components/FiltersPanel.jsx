import { useState } from 'react';

export default function FiltersPanel({ filters, onFiltersChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

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
      </button>

      {isOpen && (
        <div className="fixed top-32 right-4 z-[1000] w-72 slide-in-left">
          <div className="glass-panel rounded-2xl p-5 shadow-2xl shadow-black/30">
            <h3 className="font-display text-lg font-semibold mb-4">Filters</h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/60 w-8">${filters.priceMin}</span>
                  <input
                    type="range"
                    min={25}
                    max={150}
                    value={filters.priceMin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v <= filters.priceMax) update('priceMin', v);
                    }}
                    className="flex-1 accent-masters-green h-1"
                  />
                  <input
                    type="range"
                    min={25}
                    max={150}
                    value={filters.priceMax}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= filters.priceMin) update('priceMax', v);
                    }}
                    className="flex-1 accent-masters-green h-1"
                  />
                  <span className="text-sm text-white/60 w-8">${filters.priceMax}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">
                  Time of Day
                </label>
                <div className="flex gap-1.5">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'morning', label: 'AM' },
                    { value: 'midday', label: 'Mid' },
                    { value: 'afternoon', label: 'PM' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => update('timeOfDay', opt.value)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filters.timeOfDay === opt.value
                          ? 'bg-masters-green text-white'
                          : 'bg-white/[0.05] text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

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
