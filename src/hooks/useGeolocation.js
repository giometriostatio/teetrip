import { useState, useEffect } from 'react';
import { DEFAULT_CENTER, LOCATED_ZOOM, DEFAULT_ZOOM } from '../constants.js';

export function useGeolocation() {
  const [position, setPosition] = useState({
    lat: DEFAULT_CENTER[0],
    lng: DEFAULT_CENTER[1],
    zoom: DEFAULT_ZOOM,
    located: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          zoom: LOCATED_ZOOM,
          located: true,
        });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  return position;
}
