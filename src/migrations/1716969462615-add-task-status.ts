import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskStatus1716969462615 implements MigrationInterface {
  name = 'AddTaskStatus1716969462615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_task_entity" ("uid" varchar PRIMARY KEY NOT NULL, "id" integer NOT NULL, "description" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('todo'))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_task_entity"("uid", "id", "description") SELECT "uid", "id", "description" FROM "task_entity"`,
    );
    await queryRunner.query(`DROP TABLE "task_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_task_entity" RENAME TO "task_entity"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_entity" RENAME TO "temporary_task_entity"`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_entity" ("uid" varchar PRIMARY KEY NOT NULL, "id" integer NOT NULL, "description" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "task_entity"("uid", "id", "description") SELECT "uid", "id", "description" FROM "temporary_task_entity"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_task_entity"`);
  }
}
