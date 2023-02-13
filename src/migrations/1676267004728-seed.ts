import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1676267004728 implements MigrationInterface {
    name = 'seed1676267004728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` varchar(36) NOT NULL, \`fname\` varchar(255) NOT NULL, \`sname\` varchar(255) NOT NULL, \`lname\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`studentId\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`dob\` datetime NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), UNIQUE INDEX \`IDX_2109940ab8cb8ef76e13ba6cef\` (\`studentId\`), UNIQUE INDEX \`IDX_a13e2234cf22b150ea2e72fba6\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a13e2234cf22b150ea2e72fba6\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_2109940ab8cb8ef76e13ba6cef\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
    }

}
