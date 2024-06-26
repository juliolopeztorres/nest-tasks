import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from './task';
import { GetTaskPipe } from './get-task.pipe';

describe('GetTaskPipe', () => {
  describe('transform', () => {
    it('should return Task from valid id', async () => {
      const task = Task.create(1, 'my task');

      expect(
        await new GetTaskPipe(
          new (class implements TasksServiceInterface {
            async create(): Promise<void> {
              throw new Error('Not implemented');
            }

            async delete(): Promise<void> {
              throw new Error('Not implemented');
            }

            async get(): Promise<Task> {
              return Promise.resolve(task);
            }

            async getAll(): Promise<Task[]> {
              throw new Error('Not implemented');
            }

            async update(): Promise<void> {
              throw new Error('Not implemented');
            }
          })(),
        ).transform(1),
      ).toBe(task);
    });

    it('should throw exception with invalid id', async () => {
      await expect(
        new GetTaskPipe(
          new (class implements TasksServiceInterface {
            async create(): Promise<void> {
              throw new Error('Not implemented');
            }

            async delete(): Promise<void> {
              throw new Error('Not implemented');
            }

            async get(): Promise<Task> {
              return Promise.reject(
                new Error('Fail retrieving requested task'),
              );
            }

            async getAll(): Promise<Task[]> {
              throw new Error('Not implemented');
            }

            async update(): Promise<void> {
              throw new Error('Not implemented');
            }
          })(),
        ).transform(1),
      ).rejects.toThrow('Invalid id 1 supplied');
    });
  });
});
