import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlogpostTable1767965020429 implements MigrationInterface {
    name = 'CreateBlogpostTable1767965020429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blogpost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "content" character varying NOT NULL, "slug" character varying NOT NULL, "summary" character varying, "authorId" uuid NOT NULL, "status" "public"."blogpost_status_enum" NOT NULL DEFAULT 'draft', CONSTRAINT "UQ_b64767ad861c82b2905cd484655" UNIQUE ("title"), CONSTRAINT "UQ_3d4362fd876ef2a12e4d17084ed" UNIQUE ("slug"), CONSTRAINT "PK_3b62414e6a3029221a15c81884c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_498c7ccc7204e955957f77ba9cb" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_d8b9881e798374e4b7572cb137a" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_047ca6336edccb5326c4d178adb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_047ca6336edccb5326c4d178adb"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_d8b9881e798374e4b7572cb137a"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_498c7ccc7204e955957f77ba9cb"`);
        await queryRunner.query(`DROP TABLE "blogpost"`);
    }

}
