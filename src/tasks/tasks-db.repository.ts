import { TasksRepositoryInterface } from './tasks.repository.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskEntity } from './entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task';

@Injectable()
export class TasksDbRepository implements TasksRepositoryInterface {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async add(task: Task): Promise<void> {
    await this.tasksRepository.insert(task);
  }

  async delete(index: number): Promise<void> {
    await this.tasksRepository.delete({ id: index + 1 });
  }

  async getAll(): Promise<Task[]> {
    return (await this.tasksRepository.find()).map((task) =>
      Task.create(task.id, task.description),
    );
  }

  async update(index: number, task: Task): Promise<void> {
    const currentTask = await this.tasksRepository.findOneBy({ id: index + 1 });

    if (currentTask === null) {
      throw new Error(`Could not recover task with 'id' ${index + 1}`);
    }

    await this.tasksRepository.update(currentTask.uid, task);
  }
}
