import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1701314887234 implements MigrationInterface {
  name = "RenameTables1701314887234";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RefreshTokens" DROP CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e"`,
    );
    await queryRunner.renameTable("RefreshTokens", "refreshTokens");
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
    );
    await queryRunner.renameTable("refreshTokens", "RefreshTokens");
  }
}
