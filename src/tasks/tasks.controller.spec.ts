import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';
// import { ValidationPipe } from '@nestjs/common';

describe('TasksController', () => {
  class TaskServiceSillyMock implements TasksServiceInterface {
    async create(): Promise<void> {
      throw new Error('Not implemented');
    }

    async delete(): Promise<void> {
      throw new Error('Not implemented');
    }

    async get(): Promise<Task> {
      throw new Error('Not implemented');
    }

    async getAll(): Promise<Task[]> {
      throw new Error('Not implemented');
    }

    async update(): Promise<void> {
      throw new Error('Not implemented');
    }
  }

  const getController = async (
    service: TasksServiceInterface,
  ): Promise<TasksController> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksServiceInterface,
          useValue: service,
        },
      ],
    })
      // Following lines are e2e-likely
      // .overridePipe(ValidationPipe)
      // .useValue(new ValidationPipe({ whitelist: true }))
      .compile();

    return app.get<TasksController>(TasksController);
  };

  describe('get', () => {
    it('should return service values', async () => {
      const tasks = [Task.create(1, 'My task')];

      const tasksController = await getController(
        new (class extends TaskServiceSillyMock {
          getAll(): Promise<Task[]> {
            return Promise.resolve(tasks);
          }
        })(),
      );

      expect(await tasksController.get()).toBe(tasks);
    });
  });

  describe('create', () => {
    it('should not fail with valid data', async () => {
      const service = new (class extends TaskServiceSillyMock {
        async create() {
          // Does nothing
        }
      })();

      const createSpy = jest.spyOn(service, 'create');

      const tasksController = await getController(service);

      const request: CreateTaskRequest = {
        description: 'my description',
        userEmail: 'test@test.es',
      };
      await tasksController.create(request);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(request);
    });

    // Should be e2e
    // it('should fail with wrong request', async () => {
    //   const tasksController = await getController(new TaskServiceSillyMock());
    //
    //   const logSpy = jest.spyOn(console, 'log');
    //
    //   expect(() =>
    //     tasksController.create({} as unknown as CreateTaskRequest),
    //   ).toThrow('Bad input data');
    //   expect(logSpy).toHaveBeenCalledTimes(1);
    // });

    it('should fail when service does', async () => {
      const tasksController = await getController(new TaskServiceSillyMock());

      const logSpy = jest.spyOn(console, 'log');

      const request: CreateTaskRequest = {
        description: 'my description',
        userEmail: 'test@test.es',
      };
      await expect(tasksController.create(request)).rejects.toThrow(
        'Bad input data',
      );
      expect(logSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should not fail with valid data', async () => {
      const service = new (class extends TaskServiceSillyMock {
        async update() {
          // Does nothing
        }
      })();

      const updateSpy = jest.spyOn(service, 'update');

      const tasksController = await getController(service);

      const task = Task.create(1, 'my description');
      const request: UpdateTaskRequest = {
        id: 1,
        description: 'my other description',
      };
      await tasksController.update(task, request);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(task, request);
    });

    it('should fail when service does', async () => {
      const tasksController = await getController(new TaskServiceSillyMock());

      const task = Task.create(1, 'my description');
      const request: UpdateTaskRequest = {
        id: 1,
        description: 'my other description',
      };

      await expect(tasksController.update(task, request)).rejects.toThrow(
        'Not implemented',
      );
    });

    it('should fail when `id` mismatch', async () => {
      const tasksController = await getController(new TaskServiceSillyMock());

      const request: UpdateTaskRequest = {
        id: 20,
        description: 'updated description',
      };
      await expect(
        tasksController.update(Task.create(1, 'my task'), request),
      ).rejects.toThrow('Content mismatch');
    });
  });

  describe('delete', () => {
    it('should not fail with valid data', async () => {
      const service = new (class extends TaskServiceSillyMock {
        async delete() {
          // Does nothing
        }
      })();

      const deleteSpy = jest.spyOn(service, 'delete');

      const tasksController = await getController(service);

      const task = Task.create(1, 'my description');
      await tasksController.delete(task);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(task);
    });

    it('should fail when service does', async () => {
      const tasksController = await getController(new TaskServiceSillyMock());

      await expect(
        tasksController.delete(Task.create(1, 'my description')),
      ).rejects.toThrow('Not implemented');
    });
  });
});
