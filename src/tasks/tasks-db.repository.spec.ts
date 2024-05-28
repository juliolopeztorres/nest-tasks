import { Test, TestingModule } from '@nestjs/testing';
import { TasksDbRepository } from './tasks-db.repository';
import { TaskEntity } from './entity/task.entity';
import { Task } from './task';
import { Repository } from 'typeorm';

type RepositoryMock<T extends Record<string, any>> = {
  insert: () => Promise<void>;
  delete: () => Promise<void>;
  find: () => Promise<T[]>;
  findOneBy: () => Promise<T | null>;
  update: () => Promise<void>;
};

const insertMock = jest.fn();
const deleteMock = jest.fn();
const findMock = jest.fn();
const findOneByMock = jest.fn();
const updateMock = jest.fn();

const ormRepositoryMock = {
  insert: insertMock,
  delete: deleteMock,
  find: findMock,
  findOneBy: findOneByMock,
  update: updateMock,
};

describe('TaskDbRepository', () => {
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
      await (await getRepository(ormRepositoryMock)).add(task);

      expect(insertSpy).toHaveBeenCalled();
      expect(insertSpy).toHaveBeenCalledWith(task);
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
      const taskEntity = new TaskEntity();
      taskEntity.uid = '1234-1234-1234-1234';
      taskEntity.id = 1;
      taskEntity.description = 'my entity task';

      ormRepositoryMock.find.mockImplementationOnce(() => [taskEntity]);

      const findSpy = jest.spyOn(ormRepositoryMock, 'find');

      expect(await (await getRepository(ormRepositoryMock)).getAll()).toEqual([
        {
          id: 1,
          description: 'my entity task',
        },
      ]);

      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call findOneBy and update', async () => {
      const taskEntity = new TaskEntity();
      taskEntity.uid = '1234-1234-1234-1234';
      taskEntity.id = 1;
      taskEntity.description = 'my entity task';

      ormRepositoryMock.findOneBy.mockImplementationOnce(() => taskEntity);

      const findOneBySpy = jest.spyOn(ormRepositoryMock, 'findOneBy');
      const updateSpy = jest.spyOn(ormRepositoryMock, 'update');

      const task = Task.create(1, 'my new description');
      await (await getRepository(ormRepositoryMock)).update(0, task);

      expect(findOneBySpy).toHaveBeenCalled();
      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });

      expect(updateSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith('1234-1234-1234-1234', task);
    });

    it('should fail when no task is found', async () => {
      ormRepositoryMock.findOneBy.mockImplementationOnce(() => null);

      const findOneBySpy = jest.spyOn(ormRepositoryMock, 'findOneBy');
      const updateSpy = jest.spyOn(ormRepositoryMock, 'update');

      const task = Task.create(1, 'my new description');

      await expect(
        (await getRepository(ormRepositoryMock)).update(0, task),
      ).rejects.toThrow("Could not recover task with 'id' 1");

      expect(findOneBySpy).toHaveBeenCalled();
      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  beforeEach(() => {
    Object.values(ormRepositoryMock).forEach((method) => method.mockClear());
  });
});
