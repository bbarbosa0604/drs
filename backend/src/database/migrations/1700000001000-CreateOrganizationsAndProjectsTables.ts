import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateOrganizationsAndProjectsTables1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '160' },
          { name: 'segment', type: 'varchar', length: '120', isNullable: true },
          {
            name: 'employee_count',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'geographic_scope',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          { name: 'products_services', type: 'text', isNullable: true },
          {
            name: 'logo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          { name: 'institutional_history', type: 'text', isNullable: true },
          { name: 'business', type: 'text', isNullable: true },
          { name: 'mission', type: 'text', isNullable: true },
          { name: 'vision', type: 'text', isNullable: true },
          { name: 'values', type: 'text', isArray: true, default: "'{}'" },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '160' },
          { name: 'organization_id', type: 'uuid' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'responsible_user_id', type: 'uuid' },
          { name: 'start_date', type: 'date', isNullable: true },
          { name: 'expected_end_date', type: 'date', isNullable: true },
          { name: 'status', type: 'varchar', length: '24', default: `'DRAFT'` },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        name: 'fk_projects_organization',
        columnNames: ['organization_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        name: 'fk_projects_responsible_user',
        columnNames: ['responsible_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'organization_members',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'organization_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          {
            name: 'role',
            type: 'varchar',
            length: '24',
            default: `'consultant'`,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'organization_members',
      new TableForeignKey({
        name: 'fk_organization_members_organization',
        columnNames: ['organization_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'organization_members',
      new TableForeignKey({
        name: 'fk_organization_members_user',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'organization_members',
      new TableIndex({
        name: 'idx_organization_members_org_user',
        columnNames: ['organization_id', 'user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'project_members',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'project_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          {
            name: 'role',
            type: 'varchar',
            length: '24',
            default: `'consultant'`,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'project_members',
      new TableForeignKey({
        name: 'fk_project_members_project',
        columnNames: ['project_id'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'project_members',
      new TableForeignKey({
        name: 'fk_project_members_user',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'project_members',
      new TableIndex({
        name: 'idx_project_members_project_user',
        columnNames: ['project_id', 'user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'module_instances',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'project_id', type: 'uuid' },
          { name: 'module_key', type: 'varchar', length: '40' },
          { name: 'activated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'module_instances',
      new TableForeignKey({
        name: 'fk_module_instances_project',
        columnNames: ['project_id'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'module_instances',
      new TableIndex({
        name: 'idx_module_instances_project_module',
        columnNames: ['project_id', 'module_key'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'organization_id', type: 'uuid' },
          { name: 'project_id', type: 'uuid', isNullable: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'entity', type: 'varchar', length: '80' },
          { name: 'entity_id', type: 'uuid' },
          { name: 'action', type: 'varchar', length: '40' },
          { name: 'timestamp', type: 'timestamptz', default: 'now()' },
          { name: 'metadata', type: 'jsonb', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        name: 'fk_audit_logs_organization',
        columnNames: ['organization_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        name: 'fk_audit_logs_project',
        columnNames: ['project_id'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        name: 'fk_audit_logs_user',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_organization',
        columnNames: ['organization_id'],
      }),
    );
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_entity',
        columnNames: ['entity', 'entity_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs', true, true, true);
    await queryRunner.dropTable('module_instances', true, true, true);
    await queryRunner.dropTable('project_members', true, true, true);
    await queryRunner.dropTable('organization_members', true, true, true);
    await queryRunner.dropTable('projects', true, true, true);
    await queryRunner.dropTable('organizations', true, true, true);
  }
}
