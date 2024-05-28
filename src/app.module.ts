import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksServiceInterface } from './tasks/tasks.service.interface';
import { TasksRepositoryInterface } from './tasks/tasks.repository.interface';
import { TasksMemoryRepository } from './tasks/tasks-memory.repository';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    {
      provide: TasksRepositoryInterface,
      useClass: TasksMemoryRepository,
    },
    {
      provide: TasksServiceInterface,
      useClass: TasksService,
    },
  ],
})
export class AppModule {}
