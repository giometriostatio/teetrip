import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import coursesRouter from './routes/courses.js';
import teetimesRouter from './routes/teetimes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const hasKey = !!process.env.GOOGLE_PLACES_API_KEY;
  res.json({ status: 'ok', hasApiKey: hasKey });
});

app.use('/api/courses', coursesRouter);
app.use('/api/teetimes', teetimesRouter);

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`FairwayFinder server running on http://localhost:${PORT}`);
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.warn(
      '\n⚠️  GOOGLE_PLACES_API_KEY is not set!\n' +
        '   Copy .env.example to .env and add your key.\n' +
        '   Get one at: https://console.cloud.google.com/apis/credentials\n'
    );
  }
});
