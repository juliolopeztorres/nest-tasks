import { User } from './user';

export interface UsersServiceInterface {
  getAll(): Promise<User[]>;

  getByEmail(email: string): Promise<User>;
}

export const UsersServiceInterface = Symbol('UsersServiceInterface');
