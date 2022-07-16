interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescriptionPart extends CoursePartBase {
  description: string;
}

interface CourseSpecialPart extends CourseDescriptionPart {
  type: 'special';
  requirements: string[];
}

interface CourseNormalPart extends CourseDescriptionPart {
  type: 'normal';
}
interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject';
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescriptionPart {
  type: 'submission';
  exerciseSubmissionLink: string;
}

type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;

interface HeaderProps {
  courseName: string;
}

interface TotalProps {
  total: number;
}

const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is the leisured course part',
      type: 'normal',
    },
    {
      name: 'Advanced',
      exerciseCount: 7,
      description: 'This is the harded course part',
      type: 'normal',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      type: 'groupProject',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      exerciseSubmissionLink: 'https://fake-exercise-submit.made-up-url.dev',
      type: 'submission',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      type: 'special',
    },
  ];
  const total = courseParts.reduce(
    (carry, part) => carry + part.exerciseCount,
    0
  );
  return (
    <div>
      <Header courseName={courseName} />
      <Content parts={courseParts} />
      <Total total={total} />
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.type) {
    case 'normal':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>{' '}
          <br />
          <em>{part.description}</em>
        </div>
      );
    case 'groupProject':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>{' '}
          <br />
          Project exercises: {part.groupProjectCount}
        </div>
      );
    case 'submission':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>{' '}
          <br />
          <em>{part.description}</em>
          <br />
          Submission link: {part.exerciseSubmissionLink}
        </div>
      );
    case 'special':
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
          <br />
          Requirements: {part.requirements.join(', ')}
        </div>
      );
    default:
      return assertNever(part);
  }
};

const Header = (props: HeaderProps) => <h1>{props.courseName}</h1>;

const Content = ({ parts }: { parts: CoursePart[] }) => (
  <>
    {parts.map((p) => (
      <p key={p.name}>
        <Part part={p} />
      </p>
    ))}
  </>
);
const Total = (props: TotalProps) => <p>Number of exercises: {props.total}</p>;

export default App;
