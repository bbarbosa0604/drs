import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

/** Slice 004 - Scope Engine (Task 020, PRD secoes 12-13): Cadeia de Valor, Topologia e Arquitetura. */
export class CreateScopeEngineTables1700000006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'value_chain_blocks',
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
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'responsible_area',
            type: 'varchar',
            length: '160',
            isNullable: true,
          },
          { name: 'category', type: 'varchar', length: '30' },
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
      'value_chain_blocks',
      new TableForeignKey({
        name: 'fk_value_chain_blocks_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'value_chain_blocks',
      new TableIndex({
        name: 'idx_value_chain_blocks_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'topology_nodes',
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
          { name: 'type', type: 'varchar', length: '30' },
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
      'topology_nodes',
      new TableForeignKey({
        name: 'fk_topology_nodes_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'topology_nodes',
      new TableIndex({
        name: 'idx_topology_nodes_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'topology_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'from_node_id', type: 'uuid' },
          { name: 'to_node_id', type: 'uuid' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'link_type',
            type: 'varchar',
            length: '120',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'topology_links',
      new TableForeignKey({
        name: 'fk_topology_links_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'topology_links',
      new TableForeignKey({
        name: 'fk_topology_links_from_node',
        columnNames: ['from_node_id'],
        referencedTableName: 'topology_nodes',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'topology_links',
      new TableForeignKey({
        name: 'fk_topology_links_to_node',
        columnNames: ['to_node_id'],
        referencedTableName: 'topology_nodes',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex(
      'topology_links',
      new TableIndex({
        name: 'idx_topology_links_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );
    await queryRunner.createIndex(
      'topology_links',
      new TableIndex({
        name: 'idx_topology_links_from_node',
        columnNames: ['from_node_id'],
      }),
    );
    await queryRunner.createIndex(
      'topology_links',
      new TableIndex({
        name: 'idx_topology_links_to_node',
        columnNames: ['to_node_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'architecture_components',
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
          { name: 'layer', type: 'varchar', length: '160', isNullable: true },
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
      'architecture_components',
      new TableForeignKey({
        name: 'fk_architecture_components_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'architecture_components',
      new TableIndex({
        name: 'idx_architecture_components_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'architecture_interfaces',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'from_component_id', type: 'uuid' },
          { name: 'to_component_id', type: 'uuid' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'architecture_interfaces',
      new TableForeignKey({
        name: 'fk_architecture_interfaces_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'architecture_interfaces',
      new TableForeignKey({
        name: 'fk_architecture_interfaces_from_component',
        columnNames: ['from_component_id'],
        referencedTableName: 'architecture_components',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'architecture_interfaces',
      new TableForeignKey({
        name: 'fk_architecture_interfaces_to_component',
        columnNames: ['to_component_id'],
        referencedTableName: 'architecture_components',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex(
      'architecture_interfaces',
      new TableIndex({
        name: 'idx_architecture_interfaces_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );
    await queryRunner.createIndex(
      'architecture_interfaces',
      new TableIndex({
        name: 'idx_architecture_interfaces_from_component',
        columnNames: ['from_component_id'],
      }),
    );
    await queryRunner.createIndex(
      'architecture_interfaces',
      new TableIndex({
        name: 'idx_architecture_interfaces_to_component',
        columnNames: ['to_component_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('architecture_interfaces', true, true, true);
    await queryRunner.dropTable('architecture_components', true, true, true);
    await queryRunner.dropTable('topology_links', true, true, true);
    await queryRunner.dropTable('topology_nodes', true, true, true);
    await queryRunner.dropTable('value_chain_blocks', true, true, true);
  }
}
