import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

/** Slice 006 - Documentos gerados (Task 026, PRD secao 17/21). */
export class CreateGeneratedDocumentsTable1700000008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'generated_documents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'kind', type: 'varchar', length: '30' },
          { name: 'file_name', type: 'varchar', length: '255' },
          { name: 'mime_type', type: 'varchar', length: '160' },
          { name: 'storage_key', type: 'varchar', length: '255' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'generated_documents',
      new TableForeignKey({
        name: 'fk_generated_documents_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'generated_documents',
      new TableIndex({
        name: 'idx_generated_documents_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('generated_documents', true, true, true);
  }
}
