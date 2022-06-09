import express from 'express';
const app = express();
app.use(express.json());

import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || isNaN(Number(height))) {
    return res.json({ error: 'malformatted parameters' });
  }

  if (!weight || isNaN(Number(weight))) {
    return res.json({ error: 'malformatted parameters' });
  }

  const result = calculateBmi(Number(height), Number(weight));
  return res.json(result);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.json({ error: 'parameters missing' });
  }

  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((value) => isNaN(Number(value))) ||
    isNaN(Number(target))
  ) {
    return res.json({ error: 'malformatted parameters' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
