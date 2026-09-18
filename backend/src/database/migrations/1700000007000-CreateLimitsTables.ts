import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

/** Slice 005 - Limites, Recursos & Aprovacao (Task 023, PRD secao 14). */
export class CreateLimitsTables1700000007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'scope_locations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '160' },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'classification',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_locations',
      new TableForeignKey({
        name: 'fk_scope_locations_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_locations',
      new TableIndex({
        name: 'idx_scope_locations_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_employee_groups',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'area_or_group', type: 'varchar', length: '160' },
          { name: 'quantity', type: 'int', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'classification',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_employee_groups',
      new TableForeignKey({
        name: 'fk_scope_employee_groups_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_employee_groups',
      new TableIndex({
        name: 'idx_scope_employee_groups_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_assets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'asset_name', type: 'varchar', length: '160' },
          {
            name: 'category',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'responsible',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          {
            name: 'classification',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_assets',
      new TableForeignKey({
        name: 'fk_scope_assets_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_assets',
      new TableIndex({
        name: 'idx_scope_assets_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_providers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'provider_name', type: 'varchar', length: '160' },
          { name: 'service', type: 'varchar', length: '160', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'classification',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_providers',
      new TableForeignKey({
        name: 'fk_scope_providers_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_providers',
      new TableIndex({
        name: 'idx_scope_providers_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_approvals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'method', type: 'varchar', length: '120', isNullable: true },
          {
            name: 'platform',
            type: 'varchar',
            length: '120',
            isNullable: true,
          },
          { name: 'approval_text', type: 'text', isNullable: true },
          {
            name: 'responsible',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          { name: 'approved_at', type: 'date', isNullable: true },
          { name: 'observations', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_approvals',
      new TableForeignKey({
        name: 'fk_scope_approvals_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_approvals',
      new TableIndex({
        name: 'idx_scope_approvals_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_revisions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'version', type: 'varchar', length: '40' },
          { name: 'revised_at', type: 'date' },
          { name: 'responsible', type: 'varchar', length: '160' },
          { name: 'change_description', type: 'text' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_revisions',
      new TableForeignKey({
        name: 'fk_scope_revisions_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_revisions',
      new TableIndex({
        name: 'idx_scope_revisions_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('scope_revisions', true, true, true);
    await queryRunner.dropTable('scope_approvals', true, true, true);
    await queryRunner.dropTable('scope_providers', true, true, true);
    await queryRunner.dropTable('scope_assets', true, true, true);
    await queryRunner.dropTable('scope_employee_groups', true, true, true);
    await queryRunner.dropTable('scope_locations', true, true, true);
  }
}
