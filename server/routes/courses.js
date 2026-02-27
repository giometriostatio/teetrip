import { Router } from 'express';

const router = Router();

const courseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function cacheKey(lat, lng, radius) {
  return `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)},${radius}`;
}

router.get('/', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GOOGLE_PLACES_API_KEY is not configured on the server.',
      code: 'NO_API_KEY',
    });
  }

  const { lat, lng, radius = 16000 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const key = cacheKey(lat, lng, radius);
  const cached = courseCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.json(cached.data);
  }

  try {
    const url = new URL(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    );
    url.searchParams.set('location', `${lat},${lng}`);
    url.searchParams.set('radius', String(radius));
    url.searchParams.set('keyword', 'golf course');
    url.searchParams.set('type', 'establishment');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
      return res.status(403).json({
        error: 'Google Places API request denied. Check your API key.',
        code: 'API_DENIED',
      });
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      return res.status(429).json({
        error: 'Google Places API quota exceeded.',
        code: 'QUOTA_EXCEEDED',
      });
    }

    const courses = (data.results || []).map((place) => ({
      placeId: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.vicinity || place.formatted_address || '',
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      photoRef:
        place.photos && place.photos.length > 0
          ? place.photos[0].photo_reference
          : null,
      priceLevel: place.price_level,
      openNow: place.opening_hours?.open_now,
    }));

    const result = { courses, status: data.status };
    courseCache.set(key, { data: result, ts: Date.now() });

    res.json(result);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch golf courses' });
  }
});

router.get('/photo', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  const { ref, maxwidth = 400 } = req.query;
  if (!ref) return res.status(400).json({ error: 'ref is required' });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${ref}&key=${apiKey}`;
    const response = await fetch(url, { redirect: 'follow' });
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Error fetching photo:', err);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

export default router;
