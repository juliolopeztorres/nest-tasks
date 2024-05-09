import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';
// import { ValidationPipe } from '@nestjs/common';

describe('TasksController', () => {
  class TaskServiceSillyMock implements TasksServiceInterface {
    create(): void {
      throw new Error('Not implemented');
    }

    delete(): void {
      throw new Error('Not implemented');
    }

    get(): Promise<Task> {
      throw new Error('Not implemented');
    }

    getAll(): Promise<Task[]> {
      throw new Error('Not implemented');
    }

    update(): void {
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
        create() {
          // Does nothing
        }
      })();

      const createSpy = jest.spyOn(service, 'create');

      const tasksController = await getController(service);

      const request: CreateTaskRequest = { description: 'my description' };
      tasksController.create(request);
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
      };
      expect(() => tasksController.create(request)).toThrow('Bad input data');
      expect(logSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should not fail with valid data', async () => {
      const service = new (class extends TaskServiceSillyMock {
        update() {
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
      tasksController.update(task, request);

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

      expect(() => tasksController.update(task, request)).toThrow(
        'Not implemented',
      );
    });
  });

  describe('delete', () => {
    it('should not fail with valid data', async () => {
      const service = new (class extends TaskServiceSillyMock {
        delete() {
          // Does nothing
        }
      })();

      const deleteSpy = jest.spyOn(service, 'delete');

      const tasksController = await getController(service);

      const task = Task.create(1, 'my description');
      tasksController.delete(task);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(task);
    });

    it('should fail when service does', async () => {
      const tasksController = await getController(new TaskServiceSillyMock());

      expect(() =>
        tasksController.delete(Task.create(1, 'my description')),
      ).toThrow('Not implemented');
    });
  });
});
