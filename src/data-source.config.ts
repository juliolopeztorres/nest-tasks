import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskEntity } from './tasks/entity/task.entity';
import { configDotenv } from 'dotenv'; // Transient dependency of `TypeORM`

configDotenv();

export const dataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH as string,
  logging: false,
  entities: [TaskEntity],
});
