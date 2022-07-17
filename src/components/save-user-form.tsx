import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CreateUserWithCredentialsProperties, UserRoleEnum } from '../models/user-model';

export type ISaveUserFormInputs = CreateUserWithCredentialsProperties;

export type SaveUserFormProperties = {
  defaultValues?: Partial<ISaveUserFormInputs>;
  onSubmit: (user: ISaveUserFormInputs) => void;
  error?: string;
  title?: string;
  isLoading: boolean;
  hiddenPassword?: boolean;
};

export const SaveUserForm = ({
  error,
  title,
  isLoading,
  defaultValues,
  onSubmit,
  hiddenPassword = false,
}: SaveUserFormProperties) => {
  const { register, handleSubmit, control } = useForm<ISaveUserFormInputs>({
    defaultValues,
  });

  const getFormData: SubmitHandler<ISaveUserFormInputs> = user =>
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
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" gutterBottom component="div">
          {title}
        </Typography>

        {error && (
          <Alert severity="error" color="error">
            {error}
          </Alert>
        )}

        <Box style={{ flexDirection: 'column', display: 'flex' }}>
          <TextField
            {...register('name', { required: true })}
            required
            id="name"
            type="text"
            label="Name"
            fullWidth
          />
          <TextField
            {...register('email', { required: true })}
            required
            id="email"
            type="email"
            label="Email"
            fullWidth
          />
          {!hiddenPassword && (
            <TextField
              {...register('password', { required: true })}
              required
              type="password"
              id="password"
              label="Password"
              fullWidth
            />
          )}

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="roles">Role</InputLabel>
                <Select
                  {...field}
                  labelId="roles"
                  id="roles"
                  label="Role"
                  {...register('role', { required: true })}
                >
                  <MenuItem value={UserRoleEnum.user}>User</MenuItem>
                  <MenuItem value={UserRoleEnum.manager}>Manager</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>
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
          <br />
        </Box>
      </Box>
    </section>
  );
};
