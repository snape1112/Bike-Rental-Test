import {
  Dialog,
  DialogContent,
  DialogTitle, Snackbar
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useState } from 'react';
import { v4 } from 'uuid';
import { useDeleteUser } from '../hooks/use-delete-user';
import { useSaveUser } from '../hooks/use-save-user';
import { useUsers } from '../hooks/use-users';
import {
  CreateUserWithCredentialsProperties,
  UserProperties
} from '../models/user-model';
import { SaveUserForm } from './save-user-form';
import { stringAvatar } from '../utils/theme';
import { confirmDialog } from '../components/confirm-dialog';

export function UsersList() {
  const { data } = useUsers();
  const { mutateAsync: deleteUserMutate } = useDeleteUser();
  const { mutateAsync: saveUserMutate, isLoading } = useSaveUser();

  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [userSelected, setUserSelected] = useState({} as UserProperties);
  const [snackbarOptions, setSnackbarOptions] = useState({
    isOpen: false,
    message: '',
  });

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUserMutate(id);

      setSnackbarOptions({ isOpen: true, message: 'User deleted' });
    } catch (err) {}
  };

  const handleUpdateUser = async (user: UserProperties) => {
    setUserSelected(user);

    setIsModalUserOpen(true);
  };

  const toggleDialog = () => setIsModalUserOpen(old => !old);

  const handleCloseSnackbar = () =>
    setSnackbarOptions(old => ({ ...old, isOpen: false }));

  const onSubmitEditForm = async (
    user: CreateUserWithCredentialsProperties,
  ) => {
    try {
      await saveUserMutate({ ...user, id: userSelected.id });

      setSnackbarOptions({ isOpen: true, message: 'User updated' });

      toggleDialog();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Dialog open={isModalUserOpen} onClose={toggleDialog}>
        <DialogTitle>Update user</DialogTitle>
        <DialogContent>
          <SaveUserForm
            defaultValues={userSelected}
            isLoading={isLoading}
            onSubmit={onSubmitEditForm}
            hiddenPassword={true}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOptions.isOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        message={snackbarOptions.message}
      />

      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{width: '15%'}} align="left">Avatar</TableCell>
              <TableCell sx={{width: '15%'}} align="left">Name</TableCell>
              <TableCell sx={{width: '30%'}} align="left">Email</TableCell>
              <TableCell sx={{width: '20%'}} align="left">Role</TableCell>
              <TableCell sx={{width: '15%'}} align="right">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((user) => (
              <TableRow
                key={ v4() }
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">
                  <Avatar {...stringAvatar(user?.name || '')} />
                </TableCell>
                <TableCell align="left">{user?.name}</TableCell>
                <TableCell align="left">{user?.email}</TableCell>
                <TableCell align="left">{user?.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => confirmDialog(
                      'Are you sure you want to delete?',
                      () => handleDeleteUser(user.id)
                    )}
                    edge="end"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleUpdateUser(user)}
                    edge="end"
                    aria-label="edit"
                  >
                <EditIcon />
              </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
