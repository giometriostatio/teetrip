import { Router } from 'express';
import { generateTeeTimes } from '../utils/teetimeGenerator.js';

const router = Router();

router.get('/', (req, res) => {
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
});

router.post('/batch', (req, res) => {
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
});

export default router;
