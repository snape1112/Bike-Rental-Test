import {
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  Cancel as CancelIcon,
  Star as StarIcon
} from '@mui/icons-material';
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
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { useContext, useState, Fragment } from 'react';
import { v4 } from 'uuid';
import { AuthContext } from '../contexts/auth-context';
import { useBikes } from '../hooks/use-bikes';
import useBoolean from '../hooks/use-boolean';
import { useReserves } from '../hooks/use-reserves';
import {
  BikeProperties,
  EnumModel,
  EnumColor,
  EnumLocation,
  EnumIsAvailable
} from '../models/bike-model';
import { IReserveFormInputs } from '../models/reserve-model';
import { IRateFormInputs } from '../models/rate-model';
import { createReserve, cancelReserve } from '../services/reserve-service';
import { saveRate } from '../services/rate-service';
import { queryClient } from '../services/react-query';
import { RateBikeForm } from './rate-bike-form';
import { RentBikeForm } from './rent-bike-form';
import { SelectAll } from '../config/constants'
import { confirmDialog } from '../components/confirm-dialog';
import moment from 'moment';

export function BikesRentals() {
  const { data: bikes } = useBikes();
  const { data: reserves } = useReserves();
  const { user } = useContext(AuthContext);
  const userReserve = reserves?.find(data => data.userId === user.id);

  const [period, setPeriod] = useState<DateRange<Date>>([null, null]);
  const [filter, setFilter] = useState({
    model: SelectAll,
    color: SelectAll,
    location: SelectAll,
    rating: '0',
    isAvailable: SelectAll,
  });

  const [selectedBike, setSelectedBike] = useState<BikeProperties>(
    {} as BikeProperties,
  );

  const {
    value: isOpenBikeRateDialog,
    setFalse: handleCloseBikeRateDialog,
    setTrue: openBikeRateModal,
  } = useBoolean(false);

  const {
    value: isOpenBikeRentDialog,
    setFalse: handleCloseBikeRentDialog,
    setTrue: openBikeRentModal,
  } = useBoolean(false);

  const [snackbarOptions, setSnackbarOptions] = useState({
    isOpen: false,
    message: '',
  });

  const handleChangeFilter = (field: string, value: string) => {
    setFilter({... filter, [field]: value});
  }

  const handleCloseSnackbar = () =>
    setSnackbarOptions(old => ({ ...old, isOpen: false }));

  async function handleOpenRateModalBike(bike: BikeProperties) {
    setSelectedBike(bike);

    openBikeRateModal();
  }

  async function handleOpenRentModalBike(bike: BikeProperties) {
    openBikeRentModal();

    setSelectedBike(bike);
  }

  async function handleSaveRate(rate: IRateFormInputs) {
    try {
      await saveRate({userId: user.id, bikeId: selectedBike.id, rating: 1 * rate.rating} as IRateFormInputs);

      setSnackbarOptions({
        message: 'Bike Rating Updated',
        isOpen: true,
      });

      handleCloseBikeRateDialog();
      queryClient.invalidateQueries('bikes');
    } catch (error: any) {
      setSnackbarOptions({
        message: error.message,
        isOpen: true,
      });
    }
  }

  async function handleSaveRent(rent: IReserveFormInputs) {
    try {
      if (moment(rent.fromDate) >= moment(rent.toDate)) {
        setSnackbarOptions({
          message: 'Input Params Correctly',
          isOpen: true,
        });
        return;
      }

      const bikeReserve = reserves?.find(data => data.bikeId === selectedBike.id);
      if (bikeReserve || userReserve) {
        setSnackbarOptions({
          message: 'Already Reserved',
          isOpen: true,
        });
        return;
      }
      
      await createReserve({ ...rent, bikeId: selectedBike.id, userId: user.id });

      setSnackbarOptions({
        message: 'Bike Reserved',
        isOpen: true,
      });

      handleCloseBikeRentDialog();

      queryClient.invalidateQueries('bikes');
      queryClient.invalidateQueries('reserves');
    } catch (err) {}
  }

  async function handleCancelRent(bikeId: string) {
    try {
      await cancelReserve(user.id, bikeId);

      setSnackbarOptions({
        message: 'Rent canceled',
        isOpen: true,
      });

      queryClient.invalidateQueries('bikes');
      queryClient.invalidateQueries('reserves');
    } catch (err) {}
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

      <Dialog open={isOpenBikeRateDialog} onClose={handleCloseBikeRateDialog}>
        <DialogTitle>Rate bike</DialogTitle>
        <DialogContent>
          <RateBikeForm isLoading={false} onSubmit={handleSaveRate} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenBikeRentDialog} onClose={handleCloseBikeRentDialog}>
        <DialogTitle>Rent your bike</DialogTitle>
        <DialogContent>
          <RentBikeForm isLoading={false} onSubmit={handleSaveRent} />
        </DialogContent>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              name="model"
              value={filter.model}
              label="Model"
              onChange={(e) => handleChangeFilter(e.target.name, e.target.value)}
            >
              <MenuItem value={SelectAll}>All</MenuItem>
              <MenuItem value={EnumModel.A}>{ EnumModel.A }</MenuItem>
              <MenuItem value={EnumModel.B}>{ EnumModel.B }</MenuItem>
              <MenuItem value={EnumModel.C}>{ EnumModel.C }</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
              <InputLabel id="color-select-label">Color</InputLabel>
              <Select
                labelId="color-select-label"
                id="color-select"
                name="color"
                value={filter.color}
                label="Color"
                onChange={(e) => handleChangeFilter(e.target.name, e.target.value)}
              >
                <MenuItem value={SelectAll}>All</MenuItem>
                <MenuItem value={EnumColor.R}>{ EnumColor.R }</MenuItem>
                <MenuItem value={EnumColor.G}>{ EnumColor.G }</MenuItem>
                <MenuItem value={EnumColor.B}>{ EnumColor.B }</MenuItem>
              </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              name="location"
              value={filter.location}
              label="location"
              onChange={(e) => handleChangeFilter(e.target.name, e.target.value)}
            >
              <MenuItem value={SelectAll}>All</MenuItem>
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
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <TextField
              type="number"
              id="rating-input"
              label="Rating >="
              name="rating"
              InputProps={{ inputProps: { min: 0, max: 5 } }}
              value={filter.rating}
              onChange={(e) => handleChangeFilter(e.target.name, e.target.value)}
              focused
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="available-select-label">Available</InputLabel>
            <Select
              labelId="available-select-label"
              id="available-select"
              name="isAvailable"
              value={filter.isAvailable}
              label="available"
              onChange={(e) => handleChangeFilter(e.target.name, e.target.value)}
            >
              <MenuItem value={SelectAll}>All</MenuItem>
              <MenuItem value={EnumIsAvailable.true}>Yes</MenuItem>
              <MenuItem value={EnumIsAvailable.false}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={{ start: 'From', end: 'To' }}
            >
              <DateRangePicker
                value={period}
                onChange={(newValue: DateRange<Date>) => {
                  setPeriod(newValue);
                }}
                renderInput={(startProps: any, endProps: any) => (
                  <Fragment>
                    <TextField {...startProps} focused />
                    <Box sx={{ mx: 2 }}>  </Box>
                    <TextField {...endProps} focused />
                  </Fragment>
                )}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ my: 1}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell align="center">Color</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="center">Available</TableCell>
              <TableCell align="right">From</TableCell>
              <TableCell align="right">To</TableCell>
              <TableCell align="center">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bikes?.map(bike => {
              const bikeReserve = reserves?.find(data => data.bikeId === bike.id);

              if (filter.isAvailable != SelectAll && filter.isAvailable != bike.isAvailable)
                return;
              if (filter.model != SelectAll && filter.model != bike.model)
                return;
              if (filter.color != SelectAll && filter.color != bike.color)
                return;
              if (filter.location != SelectAll && filter.location != bike.location)
                return;
              if (parseFloat(filter.rating) > bike.rating)
                return;
              if (period[0] && period[1] && bikeReserve) {
                if (moment(period[0]) <= moment(bikeReserve.toDate) && moment(bikeReserve.fromDate) <= moment(period[1]))
                  return;
              }

              return (
                <TableRow
                  key={v4()}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {bike?.model}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        background: bike?.color,
                        borderRadius: 2,
                        padding: 0.5,
                        color: '#fff',
                      }}
                    >
                      {bike?.color}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{bike?.location}</TableCell>
                  <TableCell align="right">{bike?.rating}</TableCell>
                  <TableCell align="center">
                    {bike?.isAvailable == EnumIsAvailable.true ? (
                      <Box sx={{ color: 'green' }}>Yes</Box>
                    ) : (
                      <Box sx={{ color: 'red' }}>No</Box>
                    )}
                  </TableCell>
                  <TableCell align="right">{bikeReserve?.fromDate}</TableCell>
                  <TableCell align="right">{bikeReserve?.toDate}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      sx={{ mr: "1px"}}
                      onClick={() => handleOpenRateModalBike(bike)}
                      edge="end"
                      aria-label="edit"
                    >
                      <StarIcon />
                    </IconButton>
                    {
                      bikeReserve?.userId == user.id &&
                      <IconButton
                        color="secondary"
                        onClick={() => confirmDialog(
                          'Are you sure you want to cancel?',
                          () => handleCancelRent(bike?.id)
                        )}
                      >
                        <CancelIcon />
                      </IconButton>
                    }
                    {
                      bikeReserve == undefined &&
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleOpenRentModalBike(bike);
                        }}
                        disabled={userReserve ? true : false}
                      >
                        <ThumbUpOffAltIcon />
                      </IconButton>
                    }
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
