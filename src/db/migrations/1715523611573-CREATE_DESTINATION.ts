import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEDESTINATION1715523611573 implements MigrationInterface {
  name = "CREATEDESTINATION1715523611573";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "destinations" ("id" character varying NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "organizationId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0864cf90664ae37b598f2da88e" ON "destinations" ("organizationId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5d4c38b04e75e1278f48fa4c5f" ON "destinations" ("organizationId", "name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d4c38b04e75e1278f48fa4c5f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0864cf90664ae37b598f2da88e"`,
    );
    await queryRunner.query(`DROP TABLE "destinations"`);
  }
}
