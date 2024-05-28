import { Task } from './task';

export interface TasksRepositoryInterface {
  getAll(): Promise<Task[]>;

  add(task: Task): Promise<void>;

  update(index: number, task: Task): Promise<void>;

  delete(index: number): Promise<void>;
}

export const TasksRepositoryInterface = Symbol('TasksRepositoryInterface');
