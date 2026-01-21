import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBlogpostCategoryTable1768998293632 implements MigrationInterface {
    name = 'UpdateBlogpostCategoryTable1768998293632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_00f92ac83f4712d547635dfcbbc"`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_00f92ac83f4712d547635dfcbbc" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_00f92ac83f4712d547635dfcbbc"`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_00f92ac83f4712d547635dfcbbc" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
