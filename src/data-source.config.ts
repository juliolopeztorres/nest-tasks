import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskEntity } from './tasks/entity/task.entity';
import { configDotenv } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'; // Transient dependency of `TypeORM`

configDotenv();

const dataSourceOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  database: process.env.DB_PATH as string,
  logging: false,
  entities: [TaskEntity],
};

export const dataSource = new DataSource(dataSourceOptions);

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return dataSourceOptions;
  }
}
