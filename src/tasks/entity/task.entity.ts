import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  id: number;

  @Column()
  description: string;
}
