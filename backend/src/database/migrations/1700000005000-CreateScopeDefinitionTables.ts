import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateScopeDefinitionTables1700000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'scope_definitions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'formal_declaration', type: 'text', isNullable: true },
          { name: 'executive_justification', type: 'text', isNullable: true },
          { name: 'detailed_description', type: 'jsonb', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_definitions',
      new TableForeignKey({
        name: 'fk_scope_definitions_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_definitions',
      new TableIndex({
        name: 'idx_scope_definitions_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_characteristics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'description', type: 'text' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_characteristics',
      new TableForeignKey({
        name: 'fk_scope_characteristics_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_characteristics',
      new TableIndex({
        name: 'idx_scope_characteristics_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scope_benefits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'description', type: 'text' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'scope_benefits',
      new TableForeignKey({
        name: 'fk_scope_benefits_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'scope_benefits',
      new TableIndex({
        name: 'idx_scope_benefits_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('scope_benefits', true, true, true);
    await queryRunner.dropTable('scope_characteristics', true, true, true);
    await queryRunner.dropTable('scope_definitions', true, true, true);
  }
}
