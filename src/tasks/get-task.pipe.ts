import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Task } from './task';
import { TasksServiceInterface } from './tasks.service.interface';
import { IsNumber } from 'class-validator';

@Injectable()
export class GetTaskPipe implements PipeTransform<number, Promise<Task>> {
  constructor(
    @Inject(TasksServiceInterface)
    private readonly taskService: TasksServiceInterface,
  ) {}

  @IsNumber()
  async transform(id: number): Promise<Task> {
    try {
      return await this.taskService.get(id);
    } catch (error) {
      throw new HttpException(
        `Invalid id ${id} supplied`,
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
