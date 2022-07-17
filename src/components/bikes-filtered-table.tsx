import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useBikesRentals } from '../hooks/use-bikes-rentals';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, hide: true },
  { field: 'model', headerName: 'Model', width: 130 },
  { field: 'location', headerName: 'Location', width: 130 },
  { field: 'color', headerName: 'Color', width: 130 },
  { field: 'rating', headerName: 'Rating', width: 130 },
  { field: 'from', headerName: 'From', width: 130 },
  { field: 'to', headerName: 'To', width: 130 },
];

const rows = [{ id: 1, model: 'Snow', from: 'Jon', to: 35 }];

export function BikesFilteredList() {
  const { data: bikes = [] } = useBikesRentals();

  const bikesDataParsed = bikes?.map(bike => ({
    id: bike.id,
    model: bike.model,
    from: bike.rent.from,
    to: bike.rent.to,
    location: bike.location,
    rating: bike.rating,
    color: bike.color
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={bikesDataParsed}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
