import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import { Task } from '../task';

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  id: number;

  @Column()
  description: string;

  @Column({ default: TaskStatus.TODO })
  status: TaskStatus;

  @ManyToOne(() => UserEntity, { nullable: false })
  user: Promise<UserEntity>;

  static createFromTask(task: Task, user: UserEntity): TaskEntity {
    const entity = new TaskEntity();

    entity.id = task.id;
    entity.description = task.description;
    entity.user = Promise.resolve(user);

    return entity;
  }

  static create(id: number, description: string, user: UserEntity): TaskEntity {
    return this.createFromTask(Task.create(id, description), user);
  }
}
