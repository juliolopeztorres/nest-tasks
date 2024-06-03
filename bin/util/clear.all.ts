import { EntityManager } from 'typeorm';
import { TaskEntity } from '../../src/tasks/entity/task.entity';
import { UserEntity } from '../../src/users/entity/user.entity';

export async function clearAll(manager: EntityManager) {
  await manager.clear(TaskEntity);
  await manager.clear(UserEntity);
}
