import { BmiQuery } from './types';

interface Measurements {
  height: number;
  weight: number;
}

export const parseBmiArguments = (args: BmiQuery): Measurements => {
  const { height, weight } = args;

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    return {
      height: Number(height),
      weight: Number(weight),
    };
  } else {
    throw new Error('Provided values were not numbers');
  }
};

export const calculateBmi = (height: number, weight: number) => {
  const heightInCm = height / 100;
  const bmiValue = weight / Math.pow(heightInCm, 2);
  let bmi: string;
  if (bmiValue < 18.5) {
    bmi = 'Underweight';
  } else if (bmiValue >= 18.5 && bmiValue < 25) {
    bmi = 'Normal';
  } else if (bmiValue >= 25 && bmiValue < 30) {
    bmi = 'Overweight';
  } else {
    bmi = 'Obesse';
  }

  return {
    weight,
    height,
    bmi,
  };
};
