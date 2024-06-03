import { TasksService } from './tasks.service';
import { CreateTaskRequest } from './requests/create-task.request';
import { Task } from './task';
import { UpdateTaskRequest } from './requests/update-task.request';
import { TasksRepositoryInterface } from './tasks.repository.interface';
import { UsersRepositoryInterface } from '../users/users.repository.interface';
import { User } from '../users/user';

describe('TasksService', () => {
  class TasksRepositorySillyMock implements TasksRepositoryInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    add(task: Task, user: User): Promise<void> {
      throw new Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(index: number): Promise<void> {
      throw new Error('Not implemented');
    }

    getAll(): Promise<Task[]> {
      throw new Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(index: number, task: Task): Promise<void> {
      throw new Error('Not implemented');
    }
  }

  class UsersRepositorySillyMock implements UsersRepositoryInterface {
    getAll(): Promise<User[]> {
      throw new Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getByEmail(email: string): Promise<User> {
      throw new Error('Not implemented');
    }
  }

  const getService = (
    repository: TasksRepositoryInterface | null = null,
    userRepository: UsersRepositoryInterface | null = null,
  ): TasksService => {
    return new TasksService(
      repository ?? new TasksRepositorySillyMock(),
      userRepository ?? new UsersRepositorySillyMock(),
    );
  };

  describe('getAll', () => {
    it('should return current list value', async () => {
      expect(
        await getService(
          new (class extends TasksRepositorySillyMock {
            getAll(): Promise<Task[]> {
              return Promise.resolve([]);
            }
          })(),
        ).getAll(),
      ).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should append a new task', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          private tasks: Task[] = [];

          getAll(): Promise<Task[]> {
            return Promise.resolve(this.tasks);
          }

          add(task: Task, user: User): Promise<void> {
            this.tasks.push(Task.create(task.id, task.description, user.email));

            return Promise.resolve();
          }
        })(),
        new (class extends UsersRepositorySillyMock {
          getByEmail(email: string): Promise<User> {
            return Promise.resolve(User.create('1234-5678', email));
          }
        })(),
      );

      const request: CreateTaskRequest = {
        description: 'my new task',
        userEmail: 'test@test.es',
      };
      await tasksService.create(request);

      const tasks = await tasksService.getAll();
      expect(tasks).toHaveLength(1);
      expect(tasks).toContainEqual(
        Task.create(1, 'my new task', 'test@test.es'),
      );
    });

    it('should fail when appending a repeated task', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          getAll(): Promise<Task[]> {
            return Promise.resolve([Task.create(1, 'my new task')]);
          }
        })(),
      );

      const request: CreateTaskRequest = {
        description: 'my new task',
        userEmail: 'test@test.es',
      };
      await expect(tasksService.create(request)).rejects.toThrow(
        'Already existing task',
      );
    });
  });

  describe('get', () => {
    it('should get task by id', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          getAll(): Promise<Task[]> {
            return Promise.resolve([Task.create(1, 'my new task')]);
          }
        })(),
      );

      const task = await tasksService.get(1);
      expect(task).toEqual(Task.create(1, 'my new task'));
    });

    test.each`
      id
      ${0}
      ${18}
    `('should fail with different `id` conditions $a', async ({ id }) => {
      await expect(
        getService(
          new (class extends TasksRepositorySillyMock {
            getAll(): Promise<Task[]> {
              return Promise.resolve([]);
            }
          })(),
        ).get(id),
      ).rejects.toThrow(`Invalid id entered ${id}`);
    });
  });

  describe('update', () => {
    it('should update task with valid input data', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          private tasks: Task[] = [Task.create(1, 'my new task')];

          getAll(): Promise<Task[]> {
            return Promise.resolve(this.tasks);
          }

          update(index: number, task: Task): Promise<void> {
            this.tasks[index] = task;

            return Promise.resolve();
          }
        })(),
      );

      const request: UpdateTaskRequest = {
        id: 1,
        description: 'updated desc',
      };
      await tasksService.update(await tasksService.get(1), request);

      expect(await tasksService.getAll()).toEqual([
        Task.create(1, 'updated desc'),
      ]);
    });

    it('should fail with wrong input', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          getAll(): Promise<Task[]> {
            return Promise.resolve([]);
          }
        })(),
      );

      const request: UpdateTaskRequest = {
        id: 1,
        description: 'updated desc',
      };

      await expect(
        tasksService.update(Task.create(99, 'non existing task'), request),
      ).rejects.toThrow('Could not retrieve task 99');
    });
  });

  describe('delete', () => {
    it('should delete task', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          private tasks: Task[] = [Task.create(1, 'my new task')];

          getAll(): Promise<Task[]> {
            return Promise.resolve(this.tasks);
          }

          delete(index: number): Promise<void> {
            this.tasks.splice(index, 1);

            return Promise.resolve();
          }
        })(),
      );

      expect(await tasksService.getAll()).toHaveLength(1);

      const task = await tasksService.get(1);

      await tasksService.delete(task);

      expect(await tasksService.getAll()).toHaveLength(0);
    });

    it('should fail with wrong input', async () => {
      const tasksService = getService(
        new (class extends TasksRepositorySillyMock {
          getAll(): Promise<Task[]> {
            return Promise.resolve([]);
          }
        })(),
      );

      await expect(
        tasksService.delete(Task.create(99, 'non existing task')),
      ).rejects.toThrow('Could not retrieve task 99');
    });
  });
});
