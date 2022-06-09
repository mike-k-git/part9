export interface Diagnose {
  code: string;
  name: string;
  lating?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

export type PatientWithoutSsn = Omit<Patient, 'ssn'>;
