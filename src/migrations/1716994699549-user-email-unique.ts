import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEmailUnique1716994699549 implements MigrationInterface {
  name = 'UserEmailUnique1716994699549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "temporary_user_entity"
                             (
                                 "uid"   varchar PRIMARY KEY NOT NULL,
                                 "email" varchar(80)         NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_user_entity"("uid", "email")
                             SELECT "uid", "email"
                             FROM "user_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_user_entity" RENAME TO "user_entity"`,
    );
    await queryRunner.query(`CREATE TABLE "temporary_user_entity"
                             (
                                 "uid"   varchar PRIMARY KEY NOT NULL,
                                 "email" varchar(80)         NOT NULL,
                                 CONSTRAINT "UQ_2034c638a5d536592442ae81360" UNIQUE ("email")
                             )`);
    await queryRunner.query(`INSERT INTO "temporary_user_entity"("uid", "email")
                             SELECT "uid", "email"
                             FROM "user_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_user_entity" RENAME TO "user_entity"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" RENAME TO "temporary_user_entity"`,
    );
    await queryRunner.query(`CREATE TABLE "user_entity"
                             (
                                 "uid"   varchar PRIMARY KEY NOT NULL,
                                 "email" varchar(80)         NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "user_entity"("uid", "email")
                             SELECT "uid", "email"
                             FROM "temporary_user_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_user_entity"`);
    await queryRunner.query(
      `ALTER TABLE "user_entity" RENAME TO "temporary_user_entity"`,
    );
    await queryRunner.query(`CREATE TABLE "user_entity"
                             (
                                 "uid"   varchar PRIMARY KEY NOT NULL,
                                 "email" varchar(80)         NOT NULL
                             )`);
    await queryRunner.query(`INSERT INTO "user_entity"("uid", "email")
                             SELECT "uid", "email"
                             FROM "temporary_user_entity"`);
    await queryRunner.query(`DROP TABLE "temporary_user_entity"`);
  }
}
