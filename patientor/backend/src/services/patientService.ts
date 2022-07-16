import patientdata from '../../data/patients';
import { Patient, PublicPatient, NewPatient, Entry, NewEntry } from '../types';
import { v4 as uuid4 } from 'uuid';

const patients: Patient[] = patientdata;

const getPatientsPublicData = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatientData = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid4(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addPatientEntry = (id: string, entry: NewEntry): Entry => {
  const newPatientEntry = {
    id: uuid4(),
    ...entry,
  };
  patients.find((p) => p.id === id)?.entries.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatientsPublicData,
  addPatient,
  getPatientData,
  addPatientEntry,
};
