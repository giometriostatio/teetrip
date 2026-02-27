import { generateTeeTimes } from './_utils/teetimeGenerator.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { placeId, date, rating } = req.query;

  if (!placeId || !date) {
    return res.status(400).json({ error: 'placeId and date are required' });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'date must be YYYY-MM-DD format' });
  }

  const courseRating = rating ? parseFloat(rating) : 3.5;
  const result = generateTeeTimes(placeId, date, courseRating);

  res.json(result);
}
