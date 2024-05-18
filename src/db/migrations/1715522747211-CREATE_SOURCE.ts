import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATESOURCE1715522747211 implements MigrationInterface {
  name = "CREATESOURCE1715522747211";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sources" ("id" character varying NOT NULL, "name" character varying NOT NULL, "organizationId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85523beafe5a2a6b90b02096443" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5b17795beb7c82a67d812f00d" ON "sources" ("organizationId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b4f1d675b2ecbbdac846de7b93" ON "sources" ("organizationId", "name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4f1d675b2ecbbdac846de7b93"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5b17795beb7c82a67d812f00d"`,
    );
    await queryRunner.query(`DROP TABLE "sources"`);
  }
}
