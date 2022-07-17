import { useQuery } from 'react-query';
import { getAllUsers } from '../services/user-service';

export function useUsers() {
  return useQuery('users', () => getAllUsers());
}
