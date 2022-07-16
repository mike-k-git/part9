import { ErrorMessage, Field, FieldProps, FormikProps } from 'formik';
import { Diagnosis, EntryType, HealthCheckRating } from '../types';
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField as TextFieldMUI,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import { EntryFormValues } from './AddEntryForm';

export type EntryTypeOption = {
  value: EntryType;
  label: string;
};

type SelectFieldProps = {
  name: string;
  label: string;
  options: EntryTypeOption[];
};

const FormikSelect = ({ field, ...props }: FieldProps) => (
  <Select
    {...field}
    {...props}
    onChange={(e) => {
      let values: EntryFormValues;
      switch (e.target.value as EntryType) {
        case EntryType.HealthCheck:
          values = {
            date: '',
            description: '',
            specialist: '',
            diagnosisCodes: [],
            type: EntryType.HealthCheck,
            healthCheckRating: HealthCheckRating.Healthy,
          };
          break;
        case EntryType.Hospital:
          values = {
            date: '',
            description: '',
            specialist: '',
            diagnosisCodes: [],
            type: EntryType.Hospital,
            discharge: {
              criteria: '',
              date: '',
            },
          };
          break;
        case EntryType.OccupationalHealthcare:
          values = {
            date: '',
            description: '',
            specialist: '',
            diagnosisCodes: [],
            type: EntryType.OccupationalHealthcare,
            employerName: '',
            sickLeave: {
              startDate: '',
              endDate: '',
            },
          };
          break;
      }
      props.form.resetForm({ values });
    }}
  />
);

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: '0.5em' }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({ field, label, placeholder }: TextProps) => (
  <div style={{ marginBottom: '1em' }}>
    <TextFieldMUI
      fullWidth
      label={label}
      placeholder={placeholder}
      {...field}
    />
    <Typography variant="subtitle2" style={{ color: 'red' }}>
      <ErrorMessage name={field.name} />
    </Typography>
  </div>
);

interface NumberProps extends FieldProps {
  label: string;
  min: number;
  max: number;
  setFieldValue: FormikProps<{ healthCheckRating: number }>['setFieldValue'];
}

export const NumberField = ({
  field,
  label,
  min,
  max,
  setFieldValue,
}: NumberProps) => {
  const [value, setValue] = useState<number>(min);

  return (
    <div style={{ marginBottom: '1em' }}>
      <TextFieldMUI
        fullWidth
        label={label}
        placeholder={String(min)}
        type="number"
        {...field}
        value={value}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value === undefined || isNaN(value)) return;
          if (value > max) {
            setFieldValue('healthCheckRating', max);
            setValue(max);
          } else if (value <= min) {
            setFieldValue('healthCheckRating', min);
            setValue(min);
          } else {
            setFieldValue('healthCheckRating', Math.floor(value));
            setValue(Math.floor(value));
          }
        }}
      />
      <Typography variant="subtitle2" style={{ color: 'red' }}>
        <ErrorMessage name={field.name} />
      </Typography>
    </div>
  );
};

export const DiagnosisSelection = ({
  diagnoses,
  setFieldValue,
  setFieldTouched,
}: {
  diagnoses: Diagnosis[];
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>['setFieldValue'];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>['setFieldTouched'];
}) => {
  const [selectedDiagnoses, setDiagnoses] = useState<string[]>([]);
  const field = 'diagnosisCodes';
  const onChange = (data: string[]) => {
    setDiagnoses([...data]);
    setFieldTouched(field, true);
    setFieldValue(field, selectedDiagnoses);
  };

  const stateOptions = diagnoses.map((diagnosis) => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code,
  }));

  return (
    <FormControl style={{ width: 552, marginBottom: '30px' }}>
      <InputLabel>Diagnoses</InputLabel>
      <Select
        multiple
        value={selectedDiagnoses}
        onChange={(e) => onChange(e.target.value as string[])}
        input={<Input />}
      >
        {stateOptions.map((option) => (
          <MenuItem key={option.key} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
      <ErrorMessage name={field} />
    </FormControl>
  );
};
