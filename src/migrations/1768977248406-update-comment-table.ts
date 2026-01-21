import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentTable1768977248406 implements MigrationInterface {
    name = 'UpdateCommentTable1768977248406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."comments_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "status" "public"."comments_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "blogpost"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."comments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "blogpost"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
