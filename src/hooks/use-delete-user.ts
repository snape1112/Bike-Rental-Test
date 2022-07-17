import { FirebaseError } from 'firebase/app';
import { useMutation } from 'react-query';
import { queryClient } from '../services/react-query';
import { deleteUser } from '../services/user-service';

export function useDeleteUser() {
  return useMutation<void, FirebaseError, string>(id => deleteUser(id), {
    onMutate: userId => {
      const oldUsers = queryClient.getQueryData('users');

      queryClient.setQueryData('users', (oldUsers: any) =>
        oldUsers.filter((oldUser: any) => oldUser.id !== userId),
      );

      return () => oldUsers;
    },
    onError: (error,userId, rollback: any) => {
      if(rollback) rollback()
    },
    onSettled: () => {
      queryClient.invalidateQueries('users')
    }
    
  });
}
