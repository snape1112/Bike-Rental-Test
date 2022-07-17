import { FirebaseError } from 'firebase/app';
import { useMutation } from 'react-query';
import { ISaveUser } from '../models/user-model';
import { queryClient } from '../services/react-query';
import { saveUser } from '../services/user-service';

export function useSaveUser() {
  return useMutation<any, FirebaseError, ISaveUser>(
    async user => await saveUser(user),
    {
      onError: (err, newUser, rollback: any) => {
        if (rollback) rollback();
      },
      onSuccess: newUser => {
        queryClient.setQueryData('users', (users: any) =>
          users.map((user: any) => (user.id === newUser.id ? newUser : user)),
        );
      },
    },
  );
}
