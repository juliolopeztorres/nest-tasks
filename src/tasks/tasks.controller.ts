import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from './task';
import { CreateTaskRequest } from './requests/create-task.request';
import { UpdateTaskRequest } from './requests/update-task.request';
import { GetTaskPipe } from './get-task.pipe';
import { PositiveNumberValidationPipe } from './positive-number-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(TasksServiceInterface)
    private readonly tasksService: TasksServiceInterface,
  ) {}

  @Get()
  async get(): Promise<Task[]> {
    return await this.tasksService.getAll();
  }

  @Post()
  async create(@Body() createTaskRequest: CreateTaskRequest): Promise<void> {
    try {
      await this.tasksService.create(createTaskRequest);
    } catch (error) {
      console.log('Error creating new task', createTaskRequest, error);
      throw new HttpException('Bad input data', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', PositiveNumberValidationPipe, GetTaskPipe) task: Task,
    @Body() updateTaskRequest: UpdateTaskRequest,
  ): Promise<void> {
    if (task.id !== updateTaskRequest.id) {
      throw new HttpException('Content mismatch', HttpStatus.CONFLICT);
    }

    await this.tasksService.update(task, updateTaskRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', PositiveNumberValidationPipe, GetTaskPipe) task: Task,
  ): Promise<void> {
    await this.tasksService.delete(task);
  }
}
