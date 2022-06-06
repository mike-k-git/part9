interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseHours {
  target: number;
  hours: Array<number>;
}

const parseExerciseArguments = (args: Array<string>): ExerciseHours => {
  if (args.length < 4)
    throw new Error(
      'Provide at least a target and one exercise day, i.e, npm run calculateExercises 2 4.5'
    );
  const allArgsAreNumbers = args.slice(2).every((arg) => !isNaN(Number(arg)));
  if (allArgsAreNumbers) {
    return {
      target: Number(args[2]),
      hours: args.slice(3).map((arg) => Number(arg)),
    };
  } else {
    throw new Error('All arguments must be numbers');
  }
};

const calculateExercises = (hours: Array<number>, target: number): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((hours) => hours > 0).length;
  const average = hours.reduce((prev, sum) => prev + sum) / periodLength;
  const success = average >= target;

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

try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happend.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
