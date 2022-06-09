interface Result {
  weight: number;
  height: number;
  bmi: string;
}

export const calculateBmi = (height: number, weight: number): Result => {
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
