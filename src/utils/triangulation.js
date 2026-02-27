import { getCentroid, haversineDistance, kmToMiles } from './mapHelpers.js';

export function scoreCourses(courses, playerLocations, teeTimesMap, playerCount, filters = {}) {
  const scored = courses
    .filter((c) => {
      const tt = teeTimesMap[c.placeId];
      // Hard filter: must have availability with tee times
      return tt && tt.available && tt.teeTimes.length > 0;
    })
    .map((course) => {
      const distances = playerLocations.map((p) =>
        haversineDistance(p.lat, p.lng, course.lat, course.lng)
      );
      const maxDistKm = Math.max(...distances);
      const minDistKm = Math.min(...distances);
      const avgDistKm = distances.reduce((a, b) => a + b, 0) / distances.length;

      const tt = teeTimesMap[course.placeId];
      const fittingTimes = tt.teeTimes.filter((t) => t.slots >= playerCount);

      // Distance fairness: minimize MAX distance any player drives (40%)
      const distScore = Math.max(0, 100 - maxDistKm * 1.5);
      const fairnessBonus = Math.max(0, 50 - (maxDistKm - minDistKm) * 2);
      const distFairness = distScore * 0.7 + fairnessBonus * 0.3;

      // Tee time fit: slots that fit the group (30%)
      const fitScore = Math.min(fittingTimes.length * 5, 50);

      // Course rating (20%)
      const ratingScore = (course.rating || 3) * 10;

      // Price proximity to filter range (10%)
      let priceScore = 25;
      if (fittingTimes.length > 0 && filters.priceMin != null && filters.priceMax != null) {
        const avgPrice = fittingTimes.reduce((s, t) => s + (t.price || 0), 0) / fittingTimes.length;
        const mid = (filters.priceMin + filters.priceMax) / 2;
        priceScore = Math.max(0, 50 - Math.abs(avgPrice - mid) * 0.5);
      }

      const total = distFairness * 0.4 + fitScore * 0.3 + ratingScore * 0.2 + priceScore * 0.1;

      return {
        ...course,
        distances: distances.map((d) => kmToMiles(d)),
        maxDistance: kmToMiles(maxDistKm),
        avgDistance: kmToMiles(avgDistKm),
        fittingTimes,
        score: total,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}

export function buildExplanation(rec, playerCount) {
  const parts = [];
  if (rec.maxDistance < 15) parts.push('Close to all players');
  else if (rec.maxDistance < 30) parts.push('Reasonable drive for everyone');
  if (rec.fittingTimes.length > 0) {
    const best = rec.fittingTimes[0];
    const h = parseInt(best.time.split(':')[0], 10);
    const m = best.time.split(':')[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
    parts.push(`${hr}:${m} ${ampm} has ${best.slots} slots`);
  }
  if (rec.rating >= 4) parts.push(`${rec.rating} stars`);
  return parts.join(' · ') || 'Good match for your group';
}

export { getCentroid };
