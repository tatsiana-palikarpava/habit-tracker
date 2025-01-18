import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterHabitTable1736068421038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "habit" RENAME COLUMN "title" TO "name"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "habit" RENAME COLUMN "name" TO "title"');
    }

}
