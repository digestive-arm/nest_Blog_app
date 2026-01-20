import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttachmentTable1768551608502 implements MigrationInterface {
    name = 'CreateAttachmentTable1768551608502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "deletedAt" TIMESTAMP, "publicId" character varying NOT NULL, "url" character varying NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "UQ_3f5f2fe5d9869538784677c0cb3" UNIQUE ("publicId"), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_ede6677b9b87c7cd9f81333aa27" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_e6db36023bb2e314447080a7bb6" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_f54127860e8075e61dd7d95c80b" FOREIGN KEY ("postId") REFERENCES "blogpost"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_f54127860e8075e61dd7d95c80b"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_e6db36023bb2e314447080a7bb6"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_ede6677b9b87c7cd9f81333aa27"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
    }

}
