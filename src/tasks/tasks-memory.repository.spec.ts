import { TasksMemoryRepository } from './tasks-memory.repository';
import { Task } from './task';

describe('TaskMemoryRepository', () => {
  describe('getAll', () => {
    it('should get current snapshot', async () => {
      expect(await new TasksMemoryRepository().getAll()).toHaveLength(0);
    });
  });

  describe('add', () => {
    it('should add new task to the list', async () => {
      const taskMemoryRepository = new TasksMemoryRepository();

      const task = Task.create(1, 'my new task');
      await taskMemoryRepository.add(task);
      const tasks = await taskMemoryRepository.getAll();

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toBe(task);
    });
  });

  describe('update', () => {
    it('should update an existing task from the list', async () => {
      const taskMemoryRepository = new TasksMemoryRepository();

      await taskMemoryRepository.add(Task.create(1, 'my new task'));

      const task = Task.create(1, 'my updated task');
      await taskMemoryRepository.update(0, task);

      const tasks = await taskMemoryRepository.getAll();

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toBe(task);
    });
  });

  describe('delete', () => {
    it('should delete an existing task from the list', async () => {
      const taskMemoryRepository = new TasksMemoryRepository();

      await taskMemoryRepository.add(Task.create(1, 'my new task'));

      await taskMemoryRepository.delete(0);

      expect(await taskMemoryRepository.getAll()).toHaveLength(0);
    });
  });
});
