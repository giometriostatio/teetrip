import { useState, useRef, useCallback } from 'react';

export function useTeeTimes() {
  const [teeTimesMap, setTeeTimesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map());

  const fetchTeeTimes = useCallback(async (placeId, date, rating) => {
    const key = `${placeId}::${date}`;
    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key);
    }

    const res = await fetch(
      `/api/teetimes?placeId=${placeId}&date=${date}&rating=${rating || 3.5}`
    );
    const data = await res.json();
    cacheRef.current.set(key, data);
    setTeeTimesMap((prev) => ({ ...prev, [placeId]: data }));
    return data;
  }, []);

  const fetchBatchTeeTimes = useCallback(async (courses, date) => {
    const uncached = courses.filter(
      (c) => !cacheRef.current.has(`${c.placeId}::${date}`)
    );

    if (uncached.length === 0) {
      const result = {};
      courses.forEach((c) => {
        result[c.placeId] = cacheRef.current.get(`${c.placeId}::${date}`);
      });
      setTeeTimesMap((prev) => ({ ...prev, ...result }));
      return result;
    }

    setLoading(true);
    try {
      const ratings = {};
      uncached.forEach((c) => {
        ratings[c.placeId] = c.rating || 3.5;
      });

      const res = await fetch('/api/teetimes-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeIds: uncached.map((c) => c.placeId),
          date,
          ratings,
        }),
      });
      const data = await res.json();

      Object.entries(data).forEach(([placeId, tt]) => {
        cacheRef.current.set(`${placeId}::${date}`, tt);
      });

      const fullResult = {};
      courses.forEach((c) => {
        fullResult[c.placeId] = cacheRef.current.get(`${c.placeId}::${date}`);
      });

      setTeeTimesMap((prev) => ({ ...prev, ...fullResult }));
      return fullResult;
    } catch {
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  return { teeTimesMap, loading, fetchTeeTimes, fetchBatchTeeTimes };
}
