import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IBikeFormInputs, IBikeFormInputsDisabled, EnumModel, EnumColor, EnumLocation, EnumIsAvailable } from '../models/bike-model';
import { SelectNone } from '../config/constants'

export type BikeFormProperties = {
  defaultValues?: IBikeFormInputs;
  onSubmit: (user: IBikeFormInputs) => void;
  error?: string;
  isLoading: boolean;
  disabledInputs?: IBikeFormInputsDisabled;
};

export const BikeForm = ({
  error,
  isLoading,
  defaultValues,
  onSubmit,
  disabledInputs,
}: BikeFormProperties) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IBikeFormInputs>({
    defaultValues,
  });

  const getFormData: SubmitHandler<IBikeFormInputs> = user => onSubmit(user);

  return (
    <section>
      <Box
        component="form"
        onSubmit={handleSubmit(getFormData)}
        style={{ width: '50ch' }}
        sx={{
          '& .MuiPaper-root': { m: 1, width: '100%' },
          '& .MuiFormControl-root': { m: 1 },
          '& .MuiFormGroup-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        {error && (
          <Alert severity="error" color="error">
            {error}
          </Alert>
        )}

        <Box style={{ flexDirection: 'column', display: 'flex' }}>
          <Controller
            control={control}
            name="model"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="model">Model</InputLabel>
                <Select
                  {...field}
                  labelId="model"
                  id="available"
                  label="Model"
                  {...register('model')}
                  disabled={disabledInputs?.model}
                >
                  <MenuItem value={SelectNone}>None</MenuItem>
                  <MenuItem value={EnumModel.A}>{ EnumModel.A }</MenuItem>
                  <MenuItem value={EnumModel.B}>{ EnumModel.B }</MenuItem>
                  <MenuItem value={EnumModel.C}>{ EnumModel.C }</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="color">Color</InputLabel>
                <Select
                  {...field}
                  labelId="color"
                  id="available"
                  label="Color"
                  {...register('color')}
                  disabled={disabledInputs?.color}
                >
                  <MenuItem value={SelectNone}>None</MenuItem>
                  <MenuItem value={EnumColor.R}>{ EnumColor.R }</MenuItem>
                  <MenuItem value={EnumColor.G}>{ EnumColor.G }</MenuItem>
                  <MenuItem value={EnumColor.B}>{ EnumColor.B }</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="location">Location</InputLabel>
                <Select
                  {...field}
                  labelId="location"
                  id="available"
                  label="Location"
                  {...register('location')}
                  disabled={disabledInputs?.location}
                >
                  <MenuItem value={SelectNone}>None</MenuItem>
                  <MenuItem value={EnumLocation.AK}>{ EnumLocation.AK }</MenuItem>
                  <MenuItem value={EnumLocation.AZ}>{ EnumLocation.AZ }</MenuItem>
                  <MenuItem value={EnumLocation.AR}>{ EnumLocation.AR }</MenuItem>
                  <MenuItem value={EnumLocation.CA}>{ EnumLocation.CA }</MenuItem>
                  <MenuItem value={EnumLocation.CO}>{ EnumLocation.CO }</MenuItem>
                  <MenuItem value={EnumLocation.CT}>{ EnumLocation.CT }</MenuItem>
                  <MenuItem value={EnumLocation.DE}>{ EnumLocation.DE }</MenuItem>
                  <MenuItem value={EnumLocation.FL}>{ EnumLocation.FL }</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <TextField
            {...register('rating', { required: true, min: 0, max: 5 })}
            required
            id="rating"
            type="number"
            label="Rating"
            fullWidth
            disabled={disabledInputs?.rating}
          />
          <Controller
            control={control}
            name="isAvailable"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="available">Is Available</InputLabel>
                <Select
                  {...field}
                  labelId="available"
                  id="available"
                  label="Is Available"
                  {...register('isAvailable')}
                  disabled={disabledInputs?.isAvailable}
                >
                  <MenuItem value={EnumIsAvailable.true}>Yes</MenuItem>
                  <MenuItem value={EnumIsAvailable.false}>No</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Box style={{ margin: '8px' }}>
            <LoadingButton
              sx={{
                marginBottom: 1,
                '.MuiLoadingButton-startIconLoadingStart': {
                  marginRight: 1,
                },
              }}
              loading={isLoading}
              variant="outlined"
              type="submit"
              loadingIndicator="Saving"
            >
              Save
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </section>
  );
};
