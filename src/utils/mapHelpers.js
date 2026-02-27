export function boundsToParams(bounds) {
  const center = bounds.getCenter();
  const ne = bounds.getNorthEast();
  const R = 6371000;
  const dLat = ((ne.lat - center.lat) * Math.PI) / 180;
  const dLng = ((ne.lng - center.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((center.lat * Math.PI) / 180) *
      Math.cos((ne.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const radius = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return {
    lat: center.lat,
    lng: center.lng,
    radius: Math.min(Math.round(radius), 50000),
  };
}

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function kmToMiles(km) {
  return km * 0.621371;
}

export function getCentroid(points) {
  if (points.length === 0) return null;
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}
