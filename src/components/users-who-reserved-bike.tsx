import {
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { v4 } from 'uuid';
import { stringAvatar } from '../utils/theme';
import { useUsers } from '../hooks/use-users';
import { useBikes } from '../hooks/use-bikes';
import { useReserves } from '../hooks/use-reserves';

export function UsersWhoReservedBike() {
  const { data: users } = useUsers();
  const { data: bikes } = useBikes();
  const { data: reserves } = useReserves();

  const getReserve = (userId: string) => reserves?.find(data => data.userId === userId);
  const getBike = (bikeId: string) => bikes?.find(data => data.id === bikeId);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Avatar</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="right">Bike</TableCell>
              <TableCell align="right">From</TableCell>
              <TableCell align="right">To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map(user => {
              const reserve = getReserve(user?.id);
              if (reserve == undefined)
                return;
              const bike = getBike(reserve?.bikeId as string);

              return (
                <TableRow
                  key={v4()}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">
                    <Avatar {...stringAvatar(user?.name || '')} />
                  </TableCell>
                  <TableCell align="left">{user?.name}</TableCell>
                  <TableCell align="left">{user?.email}</TableCell>
                  <TableCell align="right" sx={{ color: bike?.color }}>{bike?.model}</TableCell>
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
