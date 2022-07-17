import { FirebaseError } from 'firebase/app';
import { useMutation } from 'react-query';
import { BikeProperties } from '../models/bike-model';
import { deleteBike } from '../services/bike-service';
import { queryClient } from '../services/react-query';

export function useDeleteBike() {
  return useMutation<void, FirebaseError, string>(id => deleteBike(id), {
    onMutate: bikeId => {
      const oldBikes = queryClient.getQueryData<BikeProperties[]>('bikes');

      queryClient.setQueryData<BikeProperties[]>('bikes', (oldBikes = []) =>
        oldBikes.filter(oldBike => oldBike?.id !== bikeId),
      );

      return () => oldBikes;
    },
    onError: (error, bike, rollback: any) => {
      if (rollback) rollback();
    },
    onSettled: () => {
      queryClient.invalidateQueries('bikes');
    },
  });
}
