import {
  Box,
  Button,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';
import { apiBaseUrl } from '../constants';
import { addEntry, updatePatient, useStateValue } from '../state';
import {
  Entry,
  Patient,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  EntryType,
} from '../types';
import { useState } from 'react';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => (
  <Box
    key={entry.id}
    border={1}
    borderColor="primary.main"
    borderRadius={10}
    p={2}
    m={2}
  >
    <Typography variant="subtitle1">Hospital</Typography>
    <EntryItem entry={entry} />
    <Box display="flex" alignItems="center" fontSize={20}>
      <Icon style={{ fontSize: '2rem' }}>local_hospital</Icon>
      <Box marginLeft={1}>
        Discharged at {entry.discharge.date}. Discharge criteria:{' '}
        {entry.discharge.criteria}
      </Box>
    </Box>
  </Box>
);

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => (
  <Box
    key={entry.id}
    border={1}
    borderColor="#b2962c"
    borderRadius={10}
    p={2}
    m={2}
  >
    <Typography variant="subtitle1">Occupational Healthcare</Typography>
    <EntryItem entry={entry} />
    <Box display="flex" flexDirection="column" fontSize={20}>
      <Box display="flex" alignItems="center">
        <Icon style={{ fontSize: '2rem' }}>work</Icon>
        <Box marginLeft={1}>{entry.employerName}</Box>
      </Box>
      {entry.sickLeave && (
        <Typography>
          Sick leave from {entry.sickLeave?.startDate} to{' '}
          {entry.sickLeave?.endDate}
        </Typography>
      )}
    </Box>
  </Box>
);

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const colors = ['green', 'yellow', 'orange', 'red'];
  return (
    <Box
      key={entry.id}
      border={1}
      borderColor="#357a38"
      borderRadius={10}
      p={2}
      m={2}
    >
      <Typography variant="subtitle1">Health Check</Typography>
      <EntryItem entry={entry} />
      <Box display="flex" alignItems="center" fontSize={20}>
        <Icon
          style={{
            fontSize: '2rem',
            color: colors[entry.healthCheckRating],
          }}
        >
          favorite
        </Icon>
      </Box>
    </Box>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case EntryType.Hospital:
      return <HospitalEntryDetails entry={entry} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case EntryType.HealthCheck:
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const DiagnosesList = ({ diagnosisCodes }: { diagnosisCodes: string[] }) => {
  const [{ diagnoses }] = useStateValue();
  const diagnosesListItemsWithDividers: React.ReactElement[] = [];
  diagnosisCodes.forEach((code, index) => {
    diagnosesListItemsWithDividers.push(
      <ListItem key={code}>
        <ListItemText>
          {code} {diagnoses[code]?.name}
        </ListItemText>
      </ListItem>
    );
    if (diagnosisCodes[index + 1] !== undefined) {
      diagnosesListItemsWithDividers.push(<Divider key={code + '_divider'} />);
    }
  });
  return <List>{diagnosesListItemsWithDividers}</List>;
};

const EntryItem = ({ entry }: { entry: Entry }) => {
  return (
    <>
      <Typography>
        {entry.date} diagnose by {entry.specialist}
      </Typography>
      <Typography>{entry.description}</Typography>
      {entry.diagnosisCodes && (
        <DiagnosesList diagnosisCodes={entry.diagnosisCodes} />
      )}
    </>
  );
};

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const patient = id ? patients[id] : null;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    if (!id) {
      return;
    }
    if (values.type === EntryType.OccupationalHealthcare) {
      if (!values.sickLeave?.startDate) {
        delete values.sickLeave;
      }
    }
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(
          String(e?.response?.data?.error || 'Unrecognized axios error')
        );
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  useEffect(() => {
    const fetchPatientInfo = async (id: string) => {
      try {
        const { data: patientInfoFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientInfoFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    if (id && patients[id]?.ssn === undefined) {
      void fetchPatientInfo(id);
    }
  }, [id, dispatch]);

  return (
    <div className="App">
      <Box style={{ marginTop: '1em' }}>
        <Box display="flex" alignItems="center" fontSize={34}>
          {patient?.name}
          <Icon style={{ marginLeft: 5, fontSize: '2rem' }}>
            {patient?.gender === 'male' ? 'male' : 'female'}
          </Icon>
        </Box>
        <Typography style={{ marginTop: '1em' }}>
          SSN: {patient?.ssn}
        </Typography>
        <Typography>Occupation: {patient?.occupation}</Typography>
        <Typography style={{ marginTop: '1em' }} variant="h4">
          Entries
        </Typography>
        {patient &&
          patient.entries &&
          patient.entries.map((entry: Entry) => (
            <EntryDetails entry={entry} key={entry.id} />
          ))}
      </Box>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientInfoPage;
