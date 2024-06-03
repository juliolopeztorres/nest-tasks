import { Task } from './task';
import { User } from '../users/user';

export interface TasksRepositoryInterface {
  getAll(): Promise<Task[]>;

  add(task: Task, user: User): Promise<void>;

  update(index: number, task: Task): Promise<void>;

  delete(index: number): Promise<void>;
}

export const TasksRepositoryInterface = Symbol('TasksRepositoryInterface');
