import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatientsPublicData());
});

router.get('/:id', (req, res) => {
  res.send(patientService.getPatientData(req.params.id));
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong. ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addPatientEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong. ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

export default router;
