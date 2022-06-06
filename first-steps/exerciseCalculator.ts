interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (hours: Array<number>, target: number): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((hours) => hours > 0).length;
  const success = trainingDays >= target;
  const average = hours.reduce((prev, sum) => prev + sum) / periodLength;

  let rating = 2;
  let ratingDescription = 'Not bad';
  if (average < target * 0.75) {
    rating = 1;
    ratingDescription = 'You should try more';
  } else if (average >= target * 1.25) {
    rating = 3;
    ratingDescription = 'Keep it up!';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
