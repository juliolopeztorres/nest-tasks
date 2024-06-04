import { Test, TestingModule } from '@nestjs/testing';
import { TasksDbRepository } from './tasks-db.repository';
import { TaskEntity } from './entity/task.entity';
import { Task } from './task';
import { Repository } from 'typeorm';
import { User } from '../users/user';
import { UserEntity } from '../users/entity/user.entity';

type RepositoryMock<T extends Record<string, any>> = {
  insert: () => Promise<void>;
  delete: () => Promise<void>;
  find: () => Promise<T[]>;
  findOneBy: () => Promise<T | null>;
  save: () => Promise<void>;
};

const insertMock = jest.fn();
const deleteMock = jest.fn();
const findMock = jest.fn();
const findOneByMock = jest.fn();
const saveMock = jest.fn();

const ormRepositoryMock = {
  insert: insertMock,
  delete: deleteMock,
  find: findMock,
  findOneBy: findOneByMock,
  save: saveMock,
};

describe('TaskDbRepository', () => {
  const userEntity = UserEntity.create('test@test.es');
  userEntity.uid = '1234-5678';

  const taskEntity = TaskEntity.create(1, 'my entity task', userEntity);
  taskEntity.uid = '1234-1234-1234-1234';

  const getRepository = async (
    repository: RepositoryMock<TaskEntity>,
  ): Promise<TasksDbRepository> => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TasksDbRepository,
          useFactory: () =>
            new TasksDbRepository(
              repository as unknown as Repository<TaskEntity>,
            ),
        },
      ],
    }).compile();

    return app.get<TasksDbRepository>(TasksDbRepository);
  };

  describe('add', () => {
    it('should call insert', async () => {
      const insertSpy = jest.spyOn(ormRepositoryMock, 'insert');

      const task = Task.create(1, 'my task');
      const user = User.create('1234-5678', 'test@test.es');
      await (await getRepository(ormRepositoryMock)).add(task, user);

      expect(insertSpy).toHaveBeenCalled();
      expect(insertSpy).toHaveBeenCalledWith(
        TaskEntity.createFromTask(task, user),
      );
    });
  });

  describe('delete', () => {
    it('should call delete', async () => {
      const deleteSpy = jest.spyOn(ormRepositoryMock, 'delete');

      await (await getRepository(ormRepositoryMock)).delete(0);

      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getAll', () => {
    it('should call find and map results', async () => {
      ormRepositoryMock.find.mockImplementationOnce(() => [taskEntity]);

      const findSpy = jest.spyOn(ormRepositoryMock, 'find');

      expect(await (await getRepository(ormRepositoryMock)).getAll()).toEqual([
        {
          id: 1,
          description: 'my entity task',
          user: 'test@test.es',
        },
      ]);

      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call findOneBy and save', async () => {
      const taskEntityUpdated = TaskEntity.create(
        taskEntity.id,
        'my new description',
        await taskEntity.user,
      );
      taskEntityUpdated.uid = taskEntity.uid;

      ormRepositoryMock.findOneBy.mockImplementationOnce(() => taskEntity);

      const findOneBySpy = jest.spyOn(ormRepositoryMock, 'findOneBy');
      const saveSpy = jest.spyOn(ormRepositoryMock, 'save');

      const task = Task.create(1, 'my new description');
      await (await getRepository(ormRepositoryMock)).update(0, task);

      expect(findOneBySpy).toHaveBeenCalled();
      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });

      expect(saveSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalledWith(taskEntityUpdated);
    });

    it('should fail when no task is found', async () => {
      ormRepositoryMock.findOneBy.mockImplementationOnce(() => null);

      const findOneBySpy = jest.spyOn(ormRepositoryMock, 'findOneBy');
      const saveSpy = jest.spyOn(ormRepositoryMock, 'save');

      const task = Task.create(1, 'my new description');

      await expect(
        (await getRepository(ormRepositoryMock)).update(0, task),
      ).rejects.toThrow("Could not recover task with 'id' 1");

      expect(findOneBySpy).toHaveBeenCalled();
      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  beforeEach(() => {
    Object.values(ormRepositoryMock).forEach((method) => method.mockClear());
  });
});
