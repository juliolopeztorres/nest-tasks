import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksServiceInterface } from './tasks/tasks.service.interface';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    {
      provide: TasksServiceInterface,
      useClass: TasksService,
    },
  ],
})
export class AppModule {}
