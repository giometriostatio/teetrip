import { useState, useRef, useCallback } from 'react';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const fetchCourses = useCallback(async (lat, lng, radius) => {
    const key = `${lat.toFixed(3)},${lng.toFixed(3)},${radius}`;
    if (cacheRef.current.has(key)) {
      const cached = cacheRef.current.get(key);
      setCourses((prev) => {
        const existingIds = new Set(prev.map((c) => c.placeId));
        const newCourses = cached.filter((c) => !existingIds.has(c.placeId));
        return newCourses.length > 0 ? [...prev, ...newCourses] : prev;
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/courses?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch courses');
        setLoading(false);
        return;
      }

      const fetched = data.courses || [];
      cacheRef.current.set(key, fetched);

      setCourses((prev) => {
        const existingIds = new Set(prev.map((c) => c.placeId));
        const newCourses = fetched.filter((c) => !existingIds.has(c.placeId));
        return newCourses.length > 0 ? [...prev, ...newCourses] : prev;
      });
    } catch (err) {
      setError('Network error — check your connection');
    } finally {
      setLoading(false);
    }
  }, []);

  return { courses, loading, error, fetchCourses, setError };
}
