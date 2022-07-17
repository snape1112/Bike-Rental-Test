import { FirebaseError } from 'firebase/app';
import { useMutation } from 'react-query';
import { BikeProperties } from '../models/bike-model';
import { updateBike } from '../services/bike-service';
import { queryClient } from '../services/react-query';

export function useSaveBike() {
  return useMutation<BikeProperties, FirebaseError, BikeProperties>(
    bike => updateBike(bike),
    {
      onSuccess: updatedBike => {
        queryClient.setQueryData<BikeProperties[]>('bikes', (bikes = []) =>
          bikes.map(bike => (bike.id === updatedBike.id ? updatedBike : bike)),
        );
      },
    },
  );
}
