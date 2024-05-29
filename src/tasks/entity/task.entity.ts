import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
