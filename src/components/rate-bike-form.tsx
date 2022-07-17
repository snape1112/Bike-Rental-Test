import { LoadingButton } from '@mui/lab';
import { Alert, Box, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRateFormInputs } from '../models/rate-model';

export type RateBikeFormProperties = {
  onSubmit: (user: IRateFormInputs) => void;
  error?: string;
  isLoading: boolean;
};

export const RateBikeForm = ({
  error,
  isLoading,
  onSubmit,
}: RateBikeFormProperties) => {
  const { register, handleSubmit } = useForm<IRateFormInputs>();

  const getFormData: SubmitHandler<IRateFormInputs> = user =>
    onSubmit(user);

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
          <TextField
            {...register('rating', { required: true, min: 0, max: 5 })}
            required
            id="rating"
            type="number"
            label="Rating"
            fullWidth
            focused
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
