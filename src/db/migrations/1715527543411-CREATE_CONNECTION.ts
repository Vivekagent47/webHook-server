import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATECONNECTION1715527543411 implements MigrationInterface {
  name = "CREATECONNECTION1715527543411";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "connection" ("id" character varying NOT NULL, "organizationId" character varying NOT NULL, "sourceId" character varying NOT NULL, "destinationId" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4686f4288821e561213240bde5" ON "connection" ("sourceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c9984e0009744b46cfd98da86" ON "connection" ("destinationId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3844e9aebf33fed40fd69e8947" ON "connection" ("organizationId", "sourceId", "destinationId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3844e9aebf33fed40fd69e8947"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c9984e0009744b46cfd98da86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4686f4288821e561213240bde5"`,
    );
    await queryRunner.query(`DROP TABLE "connection"`);
  }
}
