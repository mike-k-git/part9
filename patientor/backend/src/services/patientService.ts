import patientdata from '../../data/patients';
import { PatientEntry, PublicPatientEntry, NewPatientEntry } from '../types';
import { v4 as uuid4 } from 'uuid';

const patients: PatientEntry[] = patientdata as PatientEntry[];

const getPatientsPublicData = (): PublicPatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid4(),
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatientsPublicData,
  addPatient,
};
