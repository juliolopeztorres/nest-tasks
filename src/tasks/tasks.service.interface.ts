import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';

export interface TasksServiceInterface {
  getAll(): Promise<Task[]>;

  create(createTaskRequest: CreateTaskRequest): Promise<void>;

  get(id: number): Promise<Task>;

  update(task: Task, updateTaskRequest: UpdateTaskRequest): Promise<void>;

  delete(task: Task): Promise<void>;
}

export const TasksServiceInterface = Symbol('TasksServiceInterface');
