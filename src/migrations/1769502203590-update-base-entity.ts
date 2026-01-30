import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBaseEntity1769502203590 implements MigrationInterface {
    name = 'UpdateBaseEntity1769502203590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_e6db36023bb2e314447080a7bb6"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_ede6677b9b87c7cd9f81333aa27"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_b07b160162d21dfc683ba157b3b"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fb69fc5cdf3d7351b17eb5e9068"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e203153a6950d363e3e49361d3b"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e3df1d165376b10f89acfe3c308"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_d8b9881e798374e4b7572cb137a"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_498c7ccc7204e955957f77ba9cb"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP CONSTRAINT "FK_421c57ae0b3a36bf918bfbbe13a"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP CONSTRAINT "FK_2a97a9a3b2df7d88a48f7930805"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a19025a009be58684a63961aaf3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_82319f64187836b307e6d6ba08d"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedBy"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD "updatedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD "updatedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "updatedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updatedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "updatedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD "createdBy" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_82319f64187836b307e6d6ba08d" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a19025a009be58684a63961aaf3" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD CONSTRAINT "FK_2a97a9a3b2df7d88a48f7930805" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD CONSTRAINT "FK_421c57ae0b3a36bf918bfbbe13a" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_498c7ccc7204e955957f77ba9cb" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_d8b9881e798374e4b7572cb137a" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e3df1d165376b10f89acfe3c308" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e203153a6950d363e3e49361d3b" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fb69fc5cdf3d7351b17eb5e9068" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_b07b160162d21dfc683ba157b3b" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_ede6677b9b87c7cd9f81333aa27" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachments" ADD CONSTRAINT "FK_e6db36023bb2e314447080a7bb6" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
