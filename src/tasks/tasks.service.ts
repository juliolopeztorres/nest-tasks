import { Injectable } from '@nestjs/common';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';

@Injectable()
export class TasksService implements TasksServiceInterface {
  private tasks: Task[] = [];

  getAll(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  create(createTaskRequest: CreateTaskRequest): void {
    if (
      this.tasks.some(
        (task) => task.description === createTaskRequest.description,
      )
    ) {
      throw new Error('Already existing task');
    }

    this.tasks.push(
      Task.create(this.tasks.length + 1, createTaskRequest.description),
    );
  }

  get(id: number): Promise<Task> {
    if (id == 0 || id > this.tasks.length) {
      return Promise.reject(new Error(`Invalid id entered ${id}`));
    }

    return Promise.resolve(this.tasks[id - 1]);
  }

  update(task: Task, updateTaskRequest: UpdateTaskRequest): void {
    if (this.tasks.indexOf(task) === -1) {
      throw new Error(`Could not retrieve task ${task.id}`);
    }

    this.tasks[task.id - 1] = updateTaskRequest;
  }

  delete(task: Task): void {
    if (this.tasks.indexOf(task) === -1) {
      throw new Error(`Could not retrieve task ${task.id}`);
    }

    this.tasks.splice(task.id - 1, 1);
  }
}
