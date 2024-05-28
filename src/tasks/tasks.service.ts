import { Inject, Injectable } from '@nestjs/common';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';
import { TasksRepositoryInterface } from './tasks.repository.interface';

@Injectable()
export class TasksService implements TasksServiceInterface {
  constructor(
    @Inject(TasksRepositoryInterface)
    private readonly tasksRepository: TasksRepositoryInterface,
  ) {}

  async getAll(): Promise<Task[]> {
    return this.tasksRepository.getAll();
  }

  async create(createTaskRequest: CreateTaskRequest): Promise<void> {
    const tasks = await this.getAll();
    if (
      tasks.some((task) => task.description === createTaskRequest.description)
    ) {
      throw new Error('Already existing task');
    }

    await this.tasksRepository.add(
      Task.create(tasks.length + 1, createTaskRequest.description),
    );
  }

  async get(id: number): Promise<Task> {
    const tasks = await this.getAll();

    if (id == 0 || id > tasks.length) {
      throw new Error(`Invalid id entered ${id}`);
    }

    return tasks[id - 1];
  }

  async update(
    task: Task,
    updateTaskRequest: UpdateTaskRequest,
  ): Promise<void> {
    const tasks = await this.getAll();

    if (tasks.indexOf(task) === -1) {
      throw new Error(`Could not retrieve task ${task.id}`);
    }

    await this.tasksRepository.update(task.id - 1, updateTaskRequest);
  }

  async delete(task: Task): Promise<void> {
    const tasks = await this.getAll();

    if (tasks.indexOf(task) === -1) {
      throw new Error(`Could not retrieve task ${task.id}`);
    }

    await this.tasksRepository.delete(task.id - 1);
  }
}
