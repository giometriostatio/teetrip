import { useMemo } from 'react';
import { formatDateDisplay, addDays, todayString } from '../utils/dateUtils.js';
import { MAX_FUTURE_DAYS } from '../constants.js';

export default function DateSelector({
  selectedDate,
  onDateChange,
  availableCount,
  unavailableCount,
  loading,
}) {
  const today = todayString();
  const maxDate = addDays(today, MAX_FUTURE_DAYS);

  const canGoBack = selectedDate > today;
  const canGoForward = selectedDate < maxDate;

  const displayDate = useMemo(() => formatDateDisplay(selectedDate), [selectedDate]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-2xl">
      <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-black/20">
        <div className="hidden sm:flex items-center gap-1 mr-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
            <circle cx="12" cy="9" r="2" fill="#1a1a2e"/>
          </svg>
          <span className="font-display text-gold text-lg font-semibold tracking-tight">TeeTrip</span>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        <button
          onClick={() => canGoBack && onDateChange(addDays(selectedDate, -1))}
          disabled={!canGoBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="flex-1 text-center min-w-0">
          <div className="font-display text-base sm:text-lg font-semibold tracking-tight truncate">
            {displayDate}
          </div>
        </div>

        <button
          onClick={() => canGoForward && onDateChange(addDays(selectedDate, 1))}
          disabled={!canGoForward}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <div className="h-6 w-px bg-white/10" />

        <div className="relative flex-shrink-0">
          <input
            type="date"
            value={selectedDate}
            min={today}
            max={maxDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-8 h-8 opacity-0 absolute inset-0 cursor-pointer z-10"
          />
          <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
        </div>

        {(availableCount > 0 || unavailableCount > 0) && (
          <>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-masters-green" />
                {availableCount}
              </span>
              <span className="flex items-center gap-1 text-white/50">
                <span className="w-2 h-2 rounded-full bg-soft-red" />
                {unavailableCount}
              </span>
              {loading && (
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
