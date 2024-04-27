import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEUSERORGRELATION1714238187454 implements MigrationInterface {
  name = "CREATEUSERORGRELATION1714238187454";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_organization" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "organizationId" character varying NOT NULL, "role" "public"."user_organization_role_enum" NOT NULL DEFAULT 'member', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3e103cdf85b7d6cb620b4db0f0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29c3c8cc3ea9db22e4a347f4b5" ON "user_organization" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7143f31467178a6164a42426c1" ON "user_organization" ("organizationId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6e6630567770ae6f0a76d05ce3" ON "user_organization" ("userId", "organizationId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6e6630567770ae6f0a76d05ce3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7143f31467178a6164a42426c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_29c3c8cc3ea9db22e4a347f4b5"`,
    );
    await queryRunner.query(`DROP TABLE "user_organization"`);
  }
}
