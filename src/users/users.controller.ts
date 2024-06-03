import { Controller, Get, Inject } from '@nestjs/common';
import { UsersServiceInterface } from './users.service.interface';
import { User } from './user';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceInterface)
    private readonly usersService: UsersServiceInterface,
  ) {}

  @Get()
  async get(): Promise<User[]> {
    return await this.usersService.getAll();
  }
}
