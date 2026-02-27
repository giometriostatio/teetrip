import { useCallback } from 'react';

export function useGeocode() {
  const geocode = useCallback(async (address) => {
    if (!address || address.trim().length < 3) return null;

    try {
      const encoded = encodeURIComponent(address.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`,
        { headers: { 'User-Agent': 'TeeTrip/1.0' } }
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display: data[0].display_name,
        };
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  return { geocode };
}
