import { FirebaseError } from 'firebase/app';
import { useQuery } from 'react-query';
import { BikeProperties } from '../models/bike-model';
import { getAllBikes } from '../services/bike-service';

export function useBikes() {
  return useQuery<BikeProperties[], FirebaseError>('bikes', () =>
    getAllBikes(),
  );
}
