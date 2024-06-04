import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ length: 80, unique: true })
  email: string;

  static create(email: string): UserEntity {
    const entity = new UserEntity();

    entity.email = email;

    return entity;
  }
}
