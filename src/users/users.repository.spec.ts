import { UsersRepository } from './users.repository';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { User } from './user';

// type RepositoryMock<T extends Record<string, any>> = {
//   find: () => Promise<T[]>;
//   findOneBy: () => Promise<T | null>;
// };

const findMock = jest.fn();
const findOneByMock = jest.fn();

const ormRepositoryMock = {
  find: findMock,
  findOneBy: findOneByMock,
};

describe('UsersRepository', () => {
  const getRepository = (): UsersRepository => {
    return new UsersRepository(
      ormRepositoryMock as unknown as Repository<UserEntity>,
    );
  };

  describe('getAll', () => {
    it('should get all users from repository', async () => {
      const userEntity = UserEntity.create('test@test.es');
      userEntity.uid = '1234-5678';

      findMock.mockImplementationOnce(() => [userEntity]);

      expect(await getRepository().getAll()).toEqual([
        User.create(userEntity.uid, userEntity.email),
      ]);
      expect(findMock).toHaveBeenCalled();
    });
  });

  describe('getByEmail', () => {
    it('should get user from valid email', async () => {
      const userEntity = UserEntity.create('test@test.es');
      userEntity.uid = '1234-5678';

      findOneByMock.mockImplementationOnce(() => userEntity);

      expect(await getRepository().getByEmail('test@test.es')).toEqual(
        User.create(userEntity.uid, userEntity.email),
      );
      expect(findOneByMock).toHaveBeenCalled();
      expect(findOneByMock).toHaveBeenCalledWith({ email: 'test@test.es' });
    });

    it('should throw error on user being null', async () => {
      findOneByMock.mockImplementationOnce(() => null);

      await expect(
        async () => await getRepository().getByEmail('test@test.es'),
      ).rejects.toThrow('No user was found with email test@test.es');

      expect(findOneByMock).toHaveBeenCalled();
      expect(findOneByMock).toHaveBeenCalledWith({ email: 'test@test.es' });
    });
  });

  beforeEach(() => {
    Object.values(ormRepositoryMock).forEach((method) => method.mockClear());
  });
});
