import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { v4 } from 'uuid';
import { useUsers } from '../hooks/use-users';
import { useBikes } from '../hooks/use-bikes';
import { useReserves } from '../hooks/use-reserves';

export function BikesReservedByUser() {
  const { data: users } = useUsers();
  const { data: bikes } = useBikes();
  const { data: reserves } = useReserves();

  const getReserve = (bikeId: string) => reserves?.find(data => data.bikeId === bikeId);
  const getUser = (userId: string) => users?.find(data => data.id === userId);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Model</TableCell>
              <TableCell align="left">Location</TableCell>
              <TableCell align="left">Rating</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">From</TableCell>
              <TableCell align="right">To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bikes?.map(bike => {
              const reserve = getReserve(bike?.id);
              if (reserve == undefined)
                return;
              const user = getUser(reserve?.userId as string);

              return (
                <TableRow
                  key={v4()}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left" sx={{ color: bike?.color }}>{bike?.model}</TableCell>
                  <TableCell align="left">{bike?.location}</TableCell>
                  <TableCell align="left">{bike?.rating}</TableCell>
                  <TableCell align="right">{user?.name}</TableCell>
                  <TableCell align="right">{user?.email}</TableCell>
                  <TableCell align="right">{reserve?.fromDate}</TableCell>
                  <TableCell align="right">{reserve?.toDate}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
