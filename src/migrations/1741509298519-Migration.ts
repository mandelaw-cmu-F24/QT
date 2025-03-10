import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741509298519 implements MigrationInterface {
    name = 'Migration1741509298519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" RENAME COLUMN "shortCode" TO "shortUrl"`);
        await queryRunner.query(`ALTER TABLE "url" RENAME CONSTRAINT "UQ_df4aaf7b2c247152f3e92fe7c78" TO "UQ_5f81972de6fed8a2e99a818a8b6"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" RENAME CONSTRAINT "UQ_5f81972de6fed8a2e99a818a8b6" TO "UQ_df4aaf7b2c247152f3e92fe7c78"`);
        await queryRunner.query(`ALTER TABLE "url" RENAME COLUMN "shortUrl" TO "shortCode"`);
    }

}
