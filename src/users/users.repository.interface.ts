import { User } from './user';

export interface UsersRepositoryInterface {
  getAll(): Promise<User[]>;

  getByEmail(email: string): Promise<User>;
}

export const UsersRepositoryInterface = Symbol('UsersRepositoryInterface');
