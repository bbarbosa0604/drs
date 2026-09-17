import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateSgsiScopeTables1700000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sgsi_scopes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'project_id', type: 'uuid' },
          { name: 'module_instance_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'sgsi_scopes',
      new TableForeignKey({
        name: 'fk_sgsi_scopes_project',
        columnNames: ['project_id'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'sgsi_scopes',
      new TableForeignKey({
        name: 'fk_sgsi_scopes_module_instance',
        columnNames: ['module_instance_id'],
        referencedTableName: 'module_instances',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'sgsi_scopes',
      new TableIndex({
        name: 'idx_sgsi_scopes_project',
        columnNames: ['project_id'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'sgsi_scopes',
      new TableIndex({
        name: 'idx_sgsi_scopes_module_instance',
        columnNames: ['module_instance_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'sgsi_scope_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'version_number', type: 'int' },
          { name: 'status', type: 'varchar', length: '20', default: `'DRAFT'` },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'sgsi_scope_versions',
      new TableForeignKey({
        name: 'fk_sgsi_scope_versions_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'sgsi_scope_versions',
      new TableIndex({
        name: 'idx_sgsi_scope_versions_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'document_controls',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          {
            name: 'classification',
            type: 'varchar',
            length: '80',
            isNullable: true,
          },
          { name: 'version', type: 'varchar', length: '40', isNullable: true },
          { name: 'document_date', type: 'date', isNullable: true },
          { name: 'valid_until', type: 'date', isNullable: true },
          {
            name: 'prepared_by_user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'approved_by_user_id',
            type: 'uuid',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'document_controls',
      new TableForeignKey({
        name: 'fk_document_controls_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'document_controls',
      new TableForeignKey({
        name: 'fk_document_controls_prepared_by_user',
        columnNames: ['prepared_by_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'document_controls',
      new TableForeignKey({
        name: 'fk_document_controls_approved_by_user',
        columnNames: ['approved_by_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createIndex(
      'document_controls',
      new TableIndex({
        name: 'idx_document_controls_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('document_controls', true, true, true);
    await queryRunner.dropTable('sgsi_scope_versions', true, true, true);
    await queryRunner.dropTable('sgsi_scopes', true, true, true);
  }
}
