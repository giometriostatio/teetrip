import { generateTeeTimes } from './_utils/teetimeGenerator.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { placeIds, date, ratings } = req.body;

  if (!placeIds || !date || !Array.isArray(placeIds)) {
    return res
      .status(400)
      .json({ error: 'placeIds (array) and date are required' });
  }

  const results = {};
  for (const placeId of placeIds) {
    const courseRating =
      ratings && ratings[placeId] ? ratings[placeId] : 3.5;
    results[placeId] = generateTeeTimes(placeId, date, courseRating);
  }

  res.json(results);
}
