import { Button, Grid, InputLabel } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { useStateValue } from '../state';
import { Entry, EntryType, HealthCheckRating } from '../types';
import {
  DiagnosisSelection,
  EntryTypeOption,
  NumberField,
  SelectField,
  TextField,
} from './FormField';

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export type EntryFormValues = UnionOmit<Entry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryTypeOptions: EntryTypeOption[] = [
  { value: EntryType.Hospital, label: 'Hospital' },
  { value: EntryType.HealthCheck, label: 'Healthcheck' },
  { value: EntryType.OccupationalHealthcare, label: 'Occupational Healthcare' },
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        date: '',
        description: '',
        specialist: '',
        diagnosisCodes: [],
        type: EntryType.Hospital,
        discharge: {
          date: '',
          criteria: '',
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: {
          [field: string]: string | { [field: string]: string };
        } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        switch (values.type) {
          case EntryType.Hospital:
            if (!values.discharge.date && !values.discharge.criteria) {
              errors.discharge = {
                date: requiredError,
                criteria: requiredError,
              };
            } else {
              if (!values.discharge.date) {
                errors.discharge = { date: requiredError };
              }
              if (!values.discharge.criteria) {
                errors.discharge = { criteria: requiredError };
              }
            }
            break;
          case EntryType.HealthCheck:
            if (values.healthCheckRating === undefined) {
              errors.healthCheckRating = requiredError;
            }
            break;
          case EntryType.OccupationalHealthcare:
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            if (!values.sickLeave?.startDate && values.sickLeave?.endDate) {
              errors.sickLeave = { startDate: requiredError };
            }
            if (!values.sickLeave?.endDate && values.sickLeave?.startDate) {
              errors.sickLeave = { endDate: requiredError };
            }
            break;
          default:
            break;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <SelectField label="Type" name="type" options={entryTypeOptions} />
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              diagnoses={Object.values(diagnoses)}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
            {values.type === EntryType.HealthCheck && (
              <Field
                label="Healthcheck Rating"
                min={HealthCheckRating.Healthy}
                max={HealthCheckRating.CriticalRisk}
                name="healthCheckRating"
                component={NumberField}
                setFieldValue={setFieldValue}
              />
            )}
            {values.type === EntryType.Hospital && (
              <Grid>
                <InputLabel>Discharge</InputLabel>
                <Grid item>
                  <Field
                    label="Date"
                    placeholder="Date"
                    name="discharge.date"
                    component={TextField}
                  />
                </Grid>
                <Grid item>
                  <Field
                    label="Criteria"
                    placeholder="Criteria"
                    name="discharge.criteria"
                    component={TextField}
                  />
                </Grid>
              </Grid>
            )}
            {values.type === EntryType.OccupationalHealthcare && (
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Grid>
                  <InputLabel>Sick Leave</InputLabel>
                  <Grid item>
                    <Field
                      label="Start Date"
                      placeholder="Start Date"
                      name="sickLeave.startDate"
                      component={TextField}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      label="End Date"
                      placeholder="End Date"
                      name="sickLeave.endDate"
                      component={TextField}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: 'left' }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{ float: 'right' }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
