import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlogPostSchema1768198196975 implements MigrationInterface {
    name = 'CreateBlogPostSchema1768198196975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role-approvals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "requestedRole" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_5361f61f94491cc2dfeb3c07af0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."blogpost_status_enum" AS ENUM('published', 'draft')`);
        await queryRunner.query(`CREATE TABLE "blogpost" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "content" character varying NOT NULL, "slug" character varying NOT NULL, "summary" character varying, "authorId" uuid NOT NULL, "status" "public"."blogpost_status_enum" NOT NULL DEFAULT 'draft', CONSTRAINT "UQ_b64767ad861c82b2905cd484655" UNIQUE ("title"), CONSTRAINT "UQ_3d4362fd876ef2a12e4d17084ed" UNIQUE ("slug"), CONSTRAINT "PK_3b62414e6a3029221a15c81884c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "deletedAt" TIMESTAMP, "userName" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying(100) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT 'reader', "refreshToken" character varying, CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD CONSTRAINT "FK_2a97a9a3b2df7d88a48f7930805" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD CONSTRAINT "FK_421c57ae0b3a36bf918bfbbe13a" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role-approvals" ADD CONSTRAINT "FK_c24e7fb4b1119873902fb351907" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_498c7ccc7204e955957f77ba9cb" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_d8b9881e798374e4b7572cb137a" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogpost" ADD CONSTRAINT "FK_047ca6336edccb5326c4d178adb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_82319f64187836b307e6d6ba08d" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a19025a009be58684a63961aaf3" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a19025a009be58684a63961aaf3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_82319f64187836b307e6d6ba08d"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_047ca6336edccb5326c4d178adb"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_d8b9881e798374e4b7572cb137a"`);
        await queryRunner.query(`ALTER TABLE "blogpost" DROP CONSTRAINT "FK_498c7ccc7204e955957f77ba9cb"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP CONSTRAINT "FK_c24e7fb4b1119873902fb351907"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP CONSTRAINT "FK_421c57ae0b3a36bf918bfbbe13a"`);
        await queryRunner.query(`ALTER TABLE "role-approvals" DROP CONSTRAINT "FK_2a97a9a3b2df7d88a48f7930805"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "blogpost"`);
        await queryRunner.query(`DROP TYPE "public"."blogpost_status_enum"`);
        await queryRunner.query(`DROP TABLE "role-approvals"`);
    }

}
