import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';

export interface TasksServiceInterface {
  getAll(): Promise<Task[]>;

  create(createTaskRequest: CreateTaskRequest): void;

  get(id: number): Promise<Task>;

  update(task: Task, updateTaskRequest: UpdateTaskRequest): void;

  delete(task: Task): void;
}

export const TasksServiceInterface = Symbol('TasksServiceInterface');
