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

console.log(calculateBmi(180, 74));
