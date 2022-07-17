import { FirebaseError } from 'firebase/app';
import { useMutation } from 'react-query';
import { BikeProperties, ICreateBike } from '../models/bike-model';
import { createBike } from '../services/bike-service';
import { queryClient } from '../services/react-query';

export function useCreateBike() {
  return useMutation<BikeProperties, FirebaseError, ICreateBike>(
    bike => createBike(bike),
    {
      onMutate: newBike => {
        const oldBikes = queryClient.getQueryData<BikeProperties[]>('bikes');

        queryClient.setQueryData<BikeProperties[]>('bikes', (oldBikes = []) => [
          ...oldBikes,
          { ...newBike, id: '' },
        ]);

        return () => oldBikes;
      },
      onError: (error, bike, rollback: any) => {
        if (rollback) rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries('bikes');
      },
    },
  );
}
