import { Injectable } from '@nestjs/common';
import { Task } from './task';
import { TasksRepositoryInterface } from './tasks.repository.interface';

@Injectable()
export class TasksMemoryRepository implements TasksRepositoryInterface {
  private tasks: Task[] = [];

  async getAll(): Promise<Task[]> {
    return this.tasks.slice();
  }

  async add(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async update(index: number, task: Task): Promise<void> {
    this.tasks[index] = task;
  }

  async delete(index: number): Promise<void> {
    this.tasks.splice(index, 1);
  }
}
