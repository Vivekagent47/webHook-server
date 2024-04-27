import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEORG1714238126730 implements MigrationInterface {
  name = "CREATEORG1714238126730";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f87d3c9216522c38d3423e4fd1" ON "organization" ("created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f87d3c9216522c38d3423e4fd1"`,
    );
    await queryRunner.query(`DROP TABLE "organization"`);
  }
}
