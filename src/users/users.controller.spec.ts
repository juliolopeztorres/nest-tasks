import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersServiceInterface } from './users.service.interface';
import { User } from './user';

describe('UsersController', () => {
  class UsersServiceSillyMock implements UsersServiceInterface {
    getAll(): Promise<User[]> {
      throw new Error('Not implemented');
    }

    getByEmail(): Promise<User> {
      throw new Error('Not implemented');
    }
  }

  const getController = async (
    service: UsersServiceInterface,
  ): Promise<UsersController> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersServiceInterface,
          useValue: service,
        },
      ],
    }).compile();

    return app.get<UsersController>(UsersController);
  };

  describe('get', () => {
    it('should get all users from service', async () => {
      const users = [User.create('1234-5678', 'test@test.es')];

      const usersController = await getController(
        new (class extends UsersServiceSillyMock {
          getAll(): Promise<User[]> {
            return Promise.resolve(users);
          }
        })(),
      );

      expect(await usersController.get()).toBe(users);
    });
  });
});
