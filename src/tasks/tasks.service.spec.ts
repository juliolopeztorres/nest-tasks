import { TasksService } from './tasks.service';
import { CreateTaskRequest } from './requests/create-task.request';
import { Task } from './task';
import { UpdateTaskRequest } from './requests/update-task.request';

describe('TasksService', () => {
  describe('getAll', () => {
    it('should return current list value', async () => {
      expect(await new TasksService().getAll()).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should append a new task', async () => {
      const tasksService = new TasksService();

      const request: CreateTaskRequest = {
        description: 'my new task',
      };
      tasksService.create(request);

      const tasks = await tasksService.getAll();
      expect(tasks).toHaveLength(1);
      expect(tasks).toContainEqual(Task.create(1, 'my new task'));
    });

    it('should fail when appending a repeated task', async () => {
      const tasksService = new TasksService();

      const request: CreateTaskRequest = {
        description: 'my new task',
      };
      tasksService.create(request);

      expect(() => tasksService.create(request)).toThrow(
        'Already existing task',
      );
    });
  });

  describe('get', () => {
    it('should get task by id', async () => {
      const tasksService = new TasksService();

      const request: CreateTaskRequest = {
        description: 'my new task',
      };
      tasksService.create(request);

      const task = await tasksService.get(1);
      expect(task).toEqual(Task.create(1, 'my new task'));
    });

    test.each`
      id
      ${0}
      ${18}
    `('should fail with different `id` conditions $a', async ({ id }) => {
      await expect(new TasksService().get(id)).rejects.toThrow(
        `Invalid id entered ${id}`,
      );
    });
  });

  describe('update', () => {
    it('should update task with valid input data', async () => {
      const tasksService = new TasksService();

      const createRequest: CreateTaskRequest = {
        description: 'my new task',
      };
      tasksService.create(createRequest);

      const request: UpdateTaskRequest = {
        id: 1,
        description: 'updated desc',
      };
      tasksService.update(await tasksService.get(1), request);

      expect(await tasksService.getAll()).toEqual([
        Task.create(1, 'updated desc'),
      ]);
    });

    it('should fail with wrong input', async () => {
      const tasksService = new TasksService();

      const request: UpdateTaskRequest = {
        id: 1,
        description: 'updated desc',
      };

      expect(() =>
        tasksService.update(Task.create(99, 'non existing task'), request),
      ).toThrow('Could not retrieve task 99');
    });
  });

  describe('delete', () => {
    it('should delete task', async () => {
      const tasksService = new TasksService();

      const request: CreateTaskRequest = {
        description: 'my new task',
      };
      tasksService.create(request);

      expect(await tasksService.getAll()).toHaveLength(1);

      const task = await tasksService.get(1);

      tasksService.delete(task);

      expect(await tasksService.getAll()).toHaveLength(0);
    });

    it('should fail with wrong input', async () => {
      const tasksService = new TasksService();

      expect(() =>
        tasksService.delete(Task.create(99, 'non existing task')),
      ).toThrow('Could not retrieve task 99');
    });
  });
});
