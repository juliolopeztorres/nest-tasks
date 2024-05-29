import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksServiceInterface } from './tasks/tasks.service.interface';
import { TasksRepositoryInterface } from './tasks/tasks.repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './tasks/entity/task.entity';
import { TasksDbRepository } from './tasks/tasks-db.repository';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './data-source.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${process.env.NODE_ENV && process.env.NODE_ENV === 'test' ? '.test' : ''}`,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [TasksController],
  providers: [
    {
      provide: TasksRepositoryInterface,
      useClass: TasksDbRepository,
    },
    {
      provide: TasksServiceInterface,
      useClass: TasksService,
    },
  ],
})
export class AppModule {}
