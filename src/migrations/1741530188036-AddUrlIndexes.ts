import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlIndexes1741530188036 implements MigrationInterface {
    name = 'AddUrlIndexes1741530188036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb"`);
        await queryRunner.query(`CREATE INDEX "idx_short_url" ON "url" ("shortUrl") `);
        await queryRunner.query(`CREATE INDEX "idx_user_id" ON "url" ("userId") `);
        await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_short_url"`);
        await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
