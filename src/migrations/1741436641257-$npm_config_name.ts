import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1741436641257 implements MigrationInterface {
    name = ' $npmConfigName1741436641257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user')`);
        await queryRunner.query(`CREATE TYPE "public"."user_authtype_enum" AS ENUM('httpbasic', 'Oauth')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "authType" "public"."user_authtype_enum" NOT NULL DEFAULT 'httpbasic', "refreshToken" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_authtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
