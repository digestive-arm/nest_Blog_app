import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentTable1768802940677 implements MigrationInterface {
    name = 'UpdateCommentTable1768802940677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."comments_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "status" "public"."comments_status_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."comments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "status" character varying NOT NULL`);
    }

}
