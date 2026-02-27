export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
