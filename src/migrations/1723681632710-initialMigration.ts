import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1723681632710 implements MigrationInterface {
  name = 'InitialMigration1723681632710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP FOREIGN KEY \`customers_FK\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`orders_agents_FK\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`orders_customers_FK\``,
    );
    await queryRunner.query(`DROP INDEX \`orders_FK\` ON \`orders\``);
    await queryRunner.query(`DROP INDEX \`orders_FK_1\` ON \`orders\``);
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`grade\` \`grade\` int(11) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`agent_code\` \`agent_code\` char(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`cust_code\` \`cust_code\` char(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`agent_code\` \`agent_code\` char(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_b647c1bd599f48a6d87947da1ea\` FOREIGN KEY (\`agent_code\`) REFERENCES \`agents\`(\`agent_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_669be2d4db3d4341bad19768e85\` FOREIGN KEY (\`cust_code\`) REFERENCES \`customers\`(\`cust_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_fcaff738bc99c1ba91891fd73d4\` FOREIGN KEY (\`agent_code\`) REFERENCES \`agents\`(\`agent_code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_fcaff738bc99c1ba91891fd73d4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_669be2d4db3d4341bad19768e85\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_b647c1bd599f48a6d87947da1ea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`agent_code\` \`agent_code\` char(6) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`cust_code\` \`cust_code\` char(6) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`agent_code\` \`agent_code\` char(6) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`grade\` \`grade\` int NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`orders_FK_1\` ON \`orders\` (\`cust_code\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`orders_FK\` ON \`orders\` (\`agent_code\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`orders_customers_FK\` FOREIGN KEY (\`cust_code\`) REFERENCES \`customers\`(\`cust_code\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`orders_agents_FK\` FOREIGN KEY (\`agent_code\`) REFERENCES \`agents\`(\`agent_code\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD CONSTRAINT \`customers_FK\` FOREIGN KEY (\`agent_code\`) REFERENCES \`agents\`(\`agent_code\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }
}

