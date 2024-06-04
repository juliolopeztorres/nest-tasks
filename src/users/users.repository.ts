import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepositoryInterface } from './users.repository.interface';
import { UserEntity } from './entity/user.entity';
import { User } from './user';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<User[]> {
    return (await this.usersRepository.find()).map((user) =>
      User.create(user.uid, user.email),
    );
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });

    if (user === null) {
      throw new Error(`No user was found with email ${email}`);
    }

    return User.create(user.uid, user.email);
  }
}
