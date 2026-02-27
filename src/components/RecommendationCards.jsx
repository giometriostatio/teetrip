import { formatTime } from '../utils/dateUtils.js';
import { PLAYER_COLORS } from '../constants.js';

export default function RecommendationCards({
  recommendations,
  playerLocations,
  onCourseClick,
  onClose,
}) {
  if (recommendations.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[1000] slide-in-up">
      <div className="glass-panel rounded-2xl p-4 shadow-2xl shadow-black/30 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#c9a84c">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h3 className="font-display text-base font-semibold text-gold">
              Top Recommendations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.placeId}
              onClick={() => onCourseClick(rec)}
              className="flex-shrink-0 w-64 bg-white/[0.03] rounded-xl p-3 cursor-pointer hover:bg-white/[0.06] transition-colors border border-white/5 hover:border-gold/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold leading-tight line-clamp-1">
                    {rec.name}
                  </h4>
                </div>
                {rec.rating > 0 && (
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#c9a84c">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-xs text-gold">{rec.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-1 mb-2">
                {rec.distances.map((d, i) => (
                  playerLocations[i] && (
                    <div
                      key={i}
                      className="flex items-center gap-0.5 text-[10px] text-white/40"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: PLAYER_COLORS[i] }}
                      />
                      {d.toFixed(1)}mi
                    </div>
                  )
                ))}
              </div>

              {rec.fittingTimes.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-2">
                  {rec.fittingTimes.slice(0, 3).map((tt, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-masters-green/15 text-masters-green-light"
                    >
                      {formatTime(tt.time)} · ${tt.price}
                    </span>
                  ))}
                  {rec.fittingTimes.length > 3 && (
                    <span className="text-[10px] text-white/30 px-1">
                      +{rec.fittingTimes.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <p className="text-[10px] text-white/30 leading-snug">{rec.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
