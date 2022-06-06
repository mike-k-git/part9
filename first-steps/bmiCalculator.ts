interface Measurements {
  height: number;
  weight: number;
}

const parseBmiArguments = (args: Array<string>): Measurements => {
  if (args.length !== 4)
    throw new Error(
      'Provide exactly two arguments, i.e., "npm run calculateBmi 180 74".'
    );

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers');
  }
};

const calculateBmi = (height: number, weight: number) => {
  const cm = height / 100;
  const bmi = weight / Math.pow(cm, 2);
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obesse';
  }
};

try {
  const { height, weight } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happend.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
