import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1701314104121 implements MigrationInterface {
  name = "Migration1701314104121";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "RefreshTokens" ("id" SERIAL NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_07ff4bc1b9063ed3401f15aea10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "RefreshTokens" ADD CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RefreshTokens" DROP CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e"`,
    );
    await queryRunner.query(`DROP TABLE "RefreshTokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
