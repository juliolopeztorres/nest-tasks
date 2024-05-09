import {
  Body,
  Controller,
  Delete,
  Get,
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
  get(): Promise<Task[]> {
    return this.tasksService.getAll();
  }

  @Post()
  create(@Body() createTaskRequest: CreateTaskRequest): void {
    try {
      this.tasksService.create(createTaskRequest);
    } catch (error) {
      console.log('Error creating new task', createTaskRequest, error);
      throw new HttpException('Bad input data', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  update(
    @Param('id', PositiveNumberValidationPipe, GetTaskPipe) task: Task,
    @Body() updateTaskRequest: UpdateTaskRequest,
  ): void {
    this.tasksService.update(task, updateTaskRequest);
  }

  @Delete(':id')
  delete(
    @Param('id', PositiveNumberValidationPipe, GetTaskPipe) task: Task,
  ): void {
    this.tasksService.delete(task);
  }
}
