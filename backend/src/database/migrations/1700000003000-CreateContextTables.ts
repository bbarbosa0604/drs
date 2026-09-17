import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateContextTables1700000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization_contexts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'history', type: 'jsonb', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'organization_contexts',
      new TableForeignKey({
        name: 'fk_organization_contexts_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'organization_contexts',
      new TableIndex({
        name: 'idx_organization_contexts_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'context_aspects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'type', type: 'varchar', length: '20' },
          { name: 'title', type: 'varchar', length: '160' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'observations', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'context_aspects',
      new TableForeignKey({
        name: 'fk_context_aspects_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'context_aspects',
      new TableIndex({
        name: 'idx_context_aspects_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('context_aspects', true, true, true);
    await queryRunner.dropTable('organization_contexts', true, true, true);
  }
}
