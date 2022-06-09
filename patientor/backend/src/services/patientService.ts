import patientdata from '../../data/patients.json';
import { Patient, PatientWithoutSsn } from '../types';

const patients: Patient[] = patientdata as Patient[];

const getPatientsPublicData = (): PatientWithoutSsn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getPatientsPublicData,
};
