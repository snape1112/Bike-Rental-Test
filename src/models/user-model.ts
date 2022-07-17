export const CollectionUser = "users";

export enum UserRoleEnum {
  user = 'user',
  manager = 'manager',
}

export type UserProperties = {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
};

export type CreateUserProperties = Omit<UserProperties, 'id'>;

export type CreateUserWithCredentialsProperties = Omit<UserProperties, 'id'> & {
  password: string;
};

export type ISaveUser = UserProperties;
