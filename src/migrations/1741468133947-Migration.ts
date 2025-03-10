import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741468133947 implements MigrationInterface {
    name = 'Migration1741468133947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "url" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "originalUrl" character varying NOT NULL, "shortCode" character varying NOT NULL, "visits" integer NOT NULL DEFAULT '0', "userId" integer NOT NULL, CONSTRAINT "UQ_df4aaf7b2c247152f3e92fe7c78" UNIQUE ("shortCode"), CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb"`);
        await queryRunner.query(`DROP TABLE "url"`);
    }

}
