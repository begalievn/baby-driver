import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1717949405600 implements MigrationInterface {
  name = 'InitialMigration1717949405600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "asin" text NOT NULL, "title" text NOT NULL, "price" numeric NOT NULL, "description" text, "currency" text NOT NULL, "url" text NOT NULL, "image_url" text NOT NULL, CONSTRAINT "UQ_46922394643219da29f997bda0d" UNIQUE ("asin"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
