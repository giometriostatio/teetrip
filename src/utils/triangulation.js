import { getCentroid, haversineDistance, kmToMiles } from './mapHelpers.js';

export function scoreCourses(courses, playerLocations, teeTimesMap, playerCount) {
  const scored = courses
    .filter((c) => {
      const tt = teeTimesMap[c.placeId];
      return tt && tt.available && tt.teeTimes.length > 0;
    })
    .map((course) => {
      const distances = playerLocations.map((p) =>
        haversineDistance(p.lat, p.lng, course.lat, course.lng)
      );
      const maxDistKm = Math.max(...distances);
      const avgDistKm = distances.reduce((a, b) => a + b, 0) / distances.length;

      const tt = teeTimesMap[course.placeId];
      const fittingTimes = tt.teeTimes.filter((t) => t.slots >= playerCount);

      const distScore = Math.max(0, 100 - maxDistKm * 1.5);
      const fairnessScore = Math.max(0, 50 - (maxDistKm - Math.min(...distances)) * 2);
      const availScore = Math.min(fittingTimes.length * 5, 50);
      const ratingScore = (course.rating || 3) * 10;

      const total = distScore * 0.4 + fairnessScore * 0.2 + availScore * 0.2 + ratingScore * 0.2;

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
