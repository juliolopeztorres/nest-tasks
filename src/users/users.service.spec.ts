import { UsersService } from './users.service';
import { UsersRepositoryInterface } from './users.repository.interface';
import { User } from './user';

describe('UsersService', () => {
  class UsersRepositorySillyMock implements UsersRepositoryInterface {
    getAll(): Promise<User[]> {
      throw new Error('Not implemented');
    }

    getByEmail(): Promise<User> {
      throw new Error('Not implemented');
    }
  }

  const getService = (repository: UsersRepositoryInterface): UsersService => {
    return new UsersService(repository);
  };

  describe('getAll', () => {
    it('should get all users from repository', async () => {
      const users = [User.create('1234-5678', 'test@test.es')];

      expect(
        await getService(
          new (class extends UsersRepositorySillyMock {
            getAll(): Promise<User[]> {
              return Promise.resolve(users);
            }
          })(),
        ).getAll(),
      ).toBe(users);
    });
  });

  describe('getByEmail', () => {
    it('should get an user by its email', async () => {
      const user = User.create('1234-5678', 'test@test.es');

      const repository = new (class extends UsersRepositorySillyMock {
        getByEmail(): Promise<User> {
          return Promise.resolve(user);
        }
      })();

      const getByEmailSpy = jest.spyOn(repository, 'getByEmail');

      expect(await getService(repository).getByEmail('test@test.es')).toBe(
        user,
      );
      expect(getByEmailSpy).toHaveBeenCalled();
      expect(getByEmailSpy).toHaveBeenCalledWith('test@test.es');
    });
  });
});
