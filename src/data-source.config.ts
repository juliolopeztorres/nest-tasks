import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskEntity } from './tasks/entity/task.entity';
import { configDotenv } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'; // Transient dependency of `TypeORM`
import { AddTaskStatus1716969462615 } from './migrations/1716969462615-add-task-status';
import { UserEntity } from './users/entity/user.entity';
import { AddUserRelationToTasks1716988367220 } from './migrations/1716988367220-add-user-relation-to-tasks';
import { UserEmailUnique1716994699549 } from './migrations/1716994699549-user-email-unique';

configDotenv({
  path: `.env${process.env.NODE_ENV && process.env.NODE_ENV === 'test' ? '.test' : ''}`,
});

const dataSourceOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  database: process.env.DB_PATH as string,
  logging: false,
  entities: [TaskEntity, UserEntity],
  // Migrations need to be added explicitly so compilers load those classes correctly (and its dependencies)
  migrations: [
    AddTaskStatus1716969462615,
    AddUserRelationToTasks1716988367220,
    UserEmailUnique1716994699549,
  ],
};

export const dataSource = new DataSource(dataSourceOptions);

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return dataSourceOptions;
  }
}
