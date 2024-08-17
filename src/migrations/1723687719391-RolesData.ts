import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoles1723687719391 implements MigrationInterface {
  name = 'AddRoles1723687719391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO roles (name) VALUES
            ('admin'),
            ('agent'),
            ('customer'),
            ('guest');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM roles WHERE name IN ('admin', 'agent', 'customer', 'guest');
        `);
  }
}
