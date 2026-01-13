import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryTable1768285703569 implements MigrationInterface {
    name = 'CreateCategoryTable1768285703569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "UQ_379537fd28d1aa90393d82e9214" UNIQUE ("description"), CONSTRAINT "UQ_77d4cad977bd471fb6700595618" UNIQUE ("isActive"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fb69fc5cdf3d7351b17eb5e9068" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_b07b160162d21dfc683ba157b3b" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_00f92ac83f4712d547635dfcbbc" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_00f92ac83f4712d547635dfcbbc"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_b07b160162d21dfc683ba157b3b"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fb69fc5cdf3d7351b17eb5e9068"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
