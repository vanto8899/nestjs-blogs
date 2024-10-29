import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarToUserTable1725981730415 implements MigrationInterface {
    name = 'AddFieldAvatarToUserTable1725981730415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
