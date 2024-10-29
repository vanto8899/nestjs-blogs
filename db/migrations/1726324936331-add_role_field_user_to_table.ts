import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleFieldUserToTable1726324936331 implements MigrationInterface {
    name = 'AddRoleFieldUserToTable1726324936331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`roles\` varchar(255) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roles\``);
    }

}
