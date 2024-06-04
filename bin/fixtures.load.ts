import { dataSource } from '../src/data-source.config';
import { UserEntity } from '../src/users/entity/user.entity';
import { TaskEntity, TaskStatus } from '../src/tasks/entity/task.entity';
import { EntityManager, QueryRunner } from 'typeorm';
import { clearAll } from './util/clear.all';
import { Logger } from '@nestjs/common';

const logger = new Logger('FixturesLoad');

type UsersType = {
  testUser: UserEntity;
};

async function createUsers(manager: EntityManager): Promise<UsersType> {
  logger.log('Inserting user `test@test.es`...');
  const user = UserEntity.create('test@test.es');

  await manager.save(user);

  return {
    testUser: user,
  };
}

async function createTasks(manager: EntityManager, users: UsersType) {
  logger.log('Inserting tasks...');

  const tasks: TaskEntity[] = [];
  for (let i: number = 0; i < 10; i++) {
    const task = TaskEntity.create(
      i + 1,
      `This is the task number ${i + 1}`,
      users.testUser,
    );
    task.status = Math.random() > 0.5 ? TaskStatus.DONE : TaskStatus.TODO;

    tasks.push(task);
  }
  await manager.save(tasks);
}

async function execute(queryRunner: QueryRunner) {
  logger.log('Clearing all entities...');
  await clearAll(queryRunner.manager);

  await createTasks(
    queryRunner.manager,
    await createUsers(queryRunner.manager),
  );
}

async function bootstrap() {
  await dataSource.initialize();

  logger.log('Connecting...');
  const qr = dataSource.createQueryRunner();
  await qr.connect();

  logger.log('Starting transaction...');
  await qr.startTransaction();

  try {
    await execute(qr);

    await qr.commitTransaction();
    logger.log('Success!');
  } catch (err) {
    logger.error('Error loading fixtures', err);
    await qr.rollbackTransaction();
  } finally {
    logger.log('Releasing...');
    await qr.release();
  }
}

logger.log('Launching fixtures load...');

bootstrap();
