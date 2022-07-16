import {
  Discharge,
  EntryType,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  SickLeave,
} from './types';

type PatientFields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

type EntryFields = {
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes: unknown;
  type: unknown;
  healthCheckRating: unknown;
  discharge: unknown;
  sickLeave: unknown;
  employerName: unknown;
};

type EntryTypeStrings = keyof typeof EntryType;

export const toNewEntry = ({
  description,
  date,
  specialist,
  diagnosisCodes,
  type,
  healthCheckRating,
  discharge,
  sickLeave,
  employerName,
}: EntryFields): NewEntry => {
  const key = parseType(type);
  const newEntry = {
    type: EntryType[key],
    date: parseDate(date),
    description: parseField(description),
    specialist: parseField(specialist),
    ...(diagnosisCodes !== undefined && {
      diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
    }),
  } as NewEntry;

  switch (newEntry.type) {
    case EntryType.Hospital:
      newEntry.discharge = parseDischarge(discharge);
      break;
    case EntryType.HealthCheck:
      newEntry.healthCheckRating = parseHealthCheckRating(healthCheckRating);
      break;
    case EntryType.OccupationalHealthcare:
      newEntry.employerName = parseField(employerName);
      if (sickLeave !== undefined) {
        newEntry.sickLeave = parseSickLeave(sickLeave);
      }
      break;
    default:
      break;
  }

  return newEntry;
};

export const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: PatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseField(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseField(ssn),
    gender: parseGender(gender),
    occupation: parseField(occupation),
    entries: [],
  };

  return newPatient;
};

const parseField = (field: unknown): string => {
  if (!field || !isString(field)) {
    throw new Error('Incorrect or missing field: ' + field);
  }
  return field;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error(
      'Incorrect or missing discharge: ' + JSON.stringify(discharge)
    );
  }
  return discharge;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (param: any): param is Discharge => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { date, criteria } = param;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return isDate(date) && isString(criteria);
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || !isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing sick leave: ' + sickLeave);
  }
  return sickLeave;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickLeave = (param: any): param is SickLeave => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { startDate, endDate } = param;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return isDate(startDate) && isDate(endDate);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseType = (entryType: unknown): EntryTypeStrings => {
  if (!entryType || !isEntryType(entryType)) {
    throw new Error('Incorrect or missing entry type: ' + entryType);
  }
  return entryType;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (param: any): param is EntryTypeStrings => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(EntryType).includes(param);
};

const parseHealthCheckRating = (rating: unknown): number => {
  if (rating === undefined || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }
  return rating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is number => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

const parseDiagnosisCodes = (codes: unknown): string[] => {
  if (!codes || !Array.isArray(codes) || !isArrayOfStrings(codes)) {
    throw new Error('Incorrect diagnosis codes: ' + codes);
  }
  return codes;
};

const isArrayOfStrings = (array: unknown[]): array is string[] => {
  return array.every((item) => isString(item));
};
