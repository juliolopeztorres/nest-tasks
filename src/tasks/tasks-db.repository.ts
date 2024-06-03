import { TasksRepositoryInterface } from './tasks.repository.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskEntity } from './entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task';
import { User } from '../users/user';

@Injectable()
export class TasksDbRepository implements TasksRepositoryInterface {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async add(task: Task, user: User): Promise<void> {
    await this.tasksRepository.insert(TaskEntity.createFromTask(task, user));
  }

  async delete(index: number): Promise<void> {
    await this.tasksRepository.delete({ id: index + 1 });
  }

  async getAll(): Promise<Task[]> {
    return Promise.all(
      (await this.tasksRepository.find({ relations: { user: true } })).map(
        async (task) =>
          Task.create(task.id, task.description, (await task.user).email),
      ),
    );
  }

  async update(index: number, task: Task): Promise<void> {
    const currentTask = await this.tasksRepository.findOneBy({ id: index + 1 });

    if (currentTask === null) {
      throw new Error(`Could not recover task with 'id' ${index + 1}`);
    }

    currentTask.description = task.description;

    await this.tasksRepository.save(currentTask);
  }
}
