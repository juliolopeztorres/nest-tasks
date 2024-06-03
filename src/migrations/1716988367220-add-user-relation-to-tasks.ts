import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRelationToTasks1716988367220 implements MigrationInterface {
  name = 'AddUserRelationToTasks1716988367220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_entity"
                             (
                                 "uid"   varchar PRIMARY KEY NOT NULL,
                                 "email" varchar(80)         NOT NULL
                             )`);
    await queryRunner.query(`CREATE TABLE "temporary_task_entity"
                             (
                                 "uid"         varchar PRIMARY KEY NOT NULL,
                                 "id"          integer             NOT NULL,
                                 "description" varchar             NOT NULL,
                                 "status"      varchar             NOT NULL DEFAULT ('todo'),
                                 "userUid"     varchar             NOT NULL,
                                 CONSTRAINT "FK_bba98e991287bba3817c093e675" FOREIGN KEY ("userUid") REFERENCES "user_entity" ("uid") ON DELETE NO ACTION ON UPDATE NO ACTION
                             )`);
    await queryRunner.query(`DROP TABLE "task_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_task_entity" RENAME TO "task_entity"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_entity" RENAME TO "temporary_task_entity"`,
    );
    await queryRunner.query(`CREATE TABLE "task_entity"
                             (
                                 "uid"         varchar PRIMARY KEY NOT NULL,
                                 "id"          integer             NOT NULL,
                                 "description" varchar             NOT NULL,
                                 "status"      varchar             NOT NULL DEFAULT ('todo')
                             )`);
    await queryRunner.query(`DROP TABLE "temporary_task_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
