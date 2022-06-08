import express from 'express';
import type { Request } from 'express';
const app = express();
import { BmiQuery } from './types';

import { calculateBmi, parseBmiArguments } from './bmiCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request<{}, any, any, BmiQuery>, res) => {
  try {
    const { height, weight } = parseBmiArguments(req.query);
    res.json(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happend.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
