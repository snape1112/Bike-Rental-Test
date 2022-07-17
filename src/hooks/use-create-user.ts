import { FirebaseError } from 'firebase/app';
import { useMutation } from 'react-query';
import { CreateUserWithCredentialsProperties } from '../models/user-model';
import { queryClient } from '../services/react-query';
import { createUserWithCredentials } from '../services/user-service';

export const useCreateUser = () => {
  return useMutation<any, FirebaseError, CreateUserWithCredentialsProperties>(
    async (user: CreateUserWithCredentialsProperties) =>
      createUserWithCredentials(user), {
        onMutate: (newUser) => {
          const oldUsers = queryClient.getQueryData('users')
          
          if(oldUsers)
            queryClient.setQueryData('users', (oldUsers: any) => [...oldUsers, newUser])

          return () => oldUsers
        },
        onError: (error, newPost, rollback: any) => {
          if(rollback) rollback()
        },
        onSettled: () => {
          queryClient.invalidateQueries('users')
        }
      }
  );
};
