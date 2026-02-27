import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { createMarkerIcon, createPlayerIcon } from './CourseMarker.jsx';
import { PLAYER_COLORS, MIN_SEARCH_ZOOM } from '../constants.js';

const MapView = forwardRef(function MapView(
  {
    center,
    zoom,
    courses,
    teeTimesMap,
    recommendations,
    playerLocations,
    filters,
    selectedDate,
    onMapMove,
    onCourseClick,
  },
  ref
) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterRef = useRef(null);
  const markersRef = useRef(new Map());
  const playerMarkersRef = useRef([]);
  const recIdsRef = useRef(new Set());
  const initializedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    getMap: () => mapInstanceRef.current,
    fitBounds: (bounds, options) => {
      mapInstanceRef.current?.fitBounds(bounds, options);
    },
  }));

  useEffect(() => {
    if (mapInstanceRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 15,
    });
    map.addLayer(cluster);

    clusterRef.current = cluster;
    mapInstanceRef.current = map;

    const handler = () => {
      const bounds = map.getBounds();
      const z = map.getZoom();
      onMapMove(bounds, z);
    };

    map.on('moveend', handler);
    map.on('zoomend', handler);

    setTimeout(() => {
      handler();
      initializedRef.current = true;
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !initializedRef.current) return;
    const currentCenter = map.getCenter();
    const dist = Math.abs(currentCenter.lat - center[0]) + Math.abs(currentCenter.lng - center[1]);
    if (dist > 1) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  const recIds = new Set(recommendations.map((r) => r.placeId));
  recIdsRef.current = recIds;

  const updateMarkers = useCallback(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const currentIds = new Set(courses.map((c) => c.placeId));

    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        cluster.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    courses.forEach((course) => {
      const tt = teeTimesMap[course.placeId];
      const isRec = recIdsRef.current.has(course.placeId);

      if (filters.availableOnly && tt && !tt.available) {
        if (markersRef.current.has(course.placeId)) {
          cluster.removeLayer(markersRef.current.get(course.placeId));
          markersRef.current.delete(course.placeId);
        }
        return;
      }

      let type = 'available';
      if (isRec) type = 'recommended';
      else if (tt && !tt.available) type = 'unavailable';
      else if (!tt) type = 'available';

      const icon = createMarkerIcon(type);
      if (!icon) return;

      const existing = markersRef.current.get(course.placeId);
      if (existing) {
        existing.setIcon(icon);
      } else {
        const marker = L.marker([course.lat, course.lng], { icon });
        marker.on('click', () => onCourseClick(course));
        marker.bindTooltip(course.name, {
          direction: 'top',
          offset: [0, -44],
          className: 'glass-panel !text-white !text-xs !rounded-lg !border-0 !px-2 !py-1',
        });
        cluster.addLayer(marker);
        markersRef.current.set(course.placeId, marker);
      }
    });
  }, [courses, teeTimesMap, filters.availableOnly, onCourseClick]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers, selectedDate, recommendations]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    playerMarkersRef.current.forEach((m) => map.removeLayer(m));
    playerMarkersRef.current = [];

    playerLocations.forEach((loc, i) => {
      if (!loc) return;
      const icon = createPlayerIcon(PLAYER_COLORS[i]);
      if (!icon) return;
      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
      marker.bindTooltip(`Player ${i + 1}`, {
        direction: 'top',
        offset: [0, -16],
        className: 'glass-panel !text-white !text-xs !rounded-lg !border-0 !px-2 !py-1',
      });
      playerMarkersRef.current.push(marker);
    });
  }, [playerLocations]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0" />
  );
});

export default MapView;
