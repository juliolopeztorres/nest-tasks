import { User } from './user';
import { UsersServiceInterface } from './users.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from './users.repository.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    @Inject(UsersRepositoryInterface)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }

  getByEmail(email: string): Promise<User> {
    return this.usersRepository.getByEmail(email);
  }
}
