export default function handler(req, res) {
  const hasKey = !!process.env.GOOGLE_PLACES_API_KEY;
  res.json({ status: 'ok', hasApiKey: hasKey });
}
