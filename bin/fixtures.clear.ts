import { dataSource } from '../src/data-source.config';
import { QueryRunner } from 'typeorm';
import { clearAll } from './util/clear.all';
import { Logger } from '@nestjs/common';

const logger = new Logger('FixturesClear');

async function execute(queryRunner: QueryRunner) {
  logger.log('Clearing all entities...');
  await clearAll(queryRunner.manager);
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

logger.log('Launching fixtures clear...');

bootstrap();
