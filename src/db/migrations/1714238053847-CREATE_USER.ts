import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEUSER1714238053847 implements MigrationInterface {
  name = "CREATEUSER1714238053847";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_03585d421deb10bbc326fffe4c" ON "user" ("refreshToken") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_03585d421deb10bbc326fffe4c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
