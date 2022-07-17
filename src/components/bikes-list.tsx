import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useState } from 'react';
import { v4 } from 'uuid';
import { useBikes } from '../hooks/use-bikes';
import useBoolean from '../hooks/use-boolean';
import { useDeleteBike } from '../hooks/use-delete-bike';
import { useSaveBike } from '../hooks/use-save-bike';
import { BikeProperties, IBikeFormInputs, EnumIsAvailable } from '../models/bike-model';
import { confirmDialog } from '../components/confirm-dialog';
import { BikeForm } from './bike-form';

export function BikesList() {
  const { data: bikes } = useBikes();
  const { mutateAsync: deleteBike } = useDeleteBike();
  const {
    isLoading: isBikeLoading,
    error: updateBikeError,
    mutateAsync: updateBike,
  } = useSaveBike();

  const [selectedBike, setSelectedBike] = useState<BikeProperties>(
    {} as BikeProperties,
  );

  const {
    value: isOpenBikeEditDialog,
    setFalse: handleCloseBikeEditDialog,
    setTrue: openBikeModal,
  } = useBoolean(false);

  const [snackbarOptions, setSnackbarOptions] = useState({
    isOpen: false,
    message: '',
  });

  const handleCloseSnackbar = () =>
    setSnackbarOptions(old => ({ ...old, isOpen: false }));

  async function handleDeleteBike(id: string) {
    try {
      await deleteBike(id);

      setSnackbarOptions({
        message: 'Bike deleted',
        isOpen: true,
      });
    } catch (error: any) {
      setSnackbarOptions({
        message: error.message,
        isOpen: true,
      });
    }
  }

  async function handleUpdateBike(bike: BikeProperties) {
    setSelectedBike(bike);

    openBikeModal();
  }

  async function onSubmitBikeForm(bike: IBikeFormInputs) {
    try {
      await updateBike({ id: selectedBike.id, ...bike });

      setSnackbarOptions({
        message: 'Bike updated',
        isOpen: true,
      });

      handleCloseBikeEditDialog();
    } catch (error: any) {
      setSnackbarOptions({
        message: error.message,
        isOpen: true,
      });
    }
  }

  return (
    <>
      <Snackbar
        open={snackbarOptions.isOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        message={snackbarOptions.message}
      />

      <Dialog open={isOpenBikeEditDialog} onClose={handleCloseBikeEditDialog}>
        <DialogTitle>Add new Bike</DialogTitle>
        <DialogContent>
          <BikeForm
            onSubmit={onSubmitBikeForm}
            isLoading={isBikeLoading}
            error={updateBikeError?.message}
            defaultValues={selectedBike}
          />
        </DialogContent>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell align="center">Color</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="center">Available</TableCell>
              <TableCell align="center">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bikes?.map(bike => (
              <TableRow
                key={v4()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {bike.model}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      background: bike.color,
                      borderRadius: 2,
                      padding: 0.5,
                      color: '#fff',
                    }}
                  >
                    {bike.color}
                  </Box>
                </TableCell>
                <TableCell align="right">{bike.location}</TableCell>
                <TableCell align="right">{bike.rating}</TableCell>
                <TableCell align="center">
                  {bike.isAvailable == EnumIsAvailable.true ? (
                    <Box sx={{ color: 'green' }}>Yes</Box>
                  ) : (
                    <Box sx={{ color: 'red' }}>No</Box>
                  )}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() => confirmDialog(
                      'Are you sure you want to delete?',
                      () => handleDeleteBike(bike.id)
                    )}
                    edge="end"
                    aria-label="delete"
                    sx={{ marginRight: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleUpdateBike(bike)}
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
