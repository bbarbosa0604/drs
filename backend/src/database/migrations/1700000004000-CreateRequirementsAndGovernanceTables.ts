import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

/** Biblioteca inicial de requisitos legais brasileiros (PRD secao 10.2). */
const SEED_REQUIREMENTS: Array<{ title: string; description: string }> = [
  {
    title: 'Constituicao Federal',
    description: 'Constituicao da Republica Federativa do Brasil de 1988.',
  },
  {
    title: 'LGPD',
    description: 'Lei Geral de Protecao de Dados Pessoais (Lei 13.709/2018).',
  },
  { title: 'Marco Civil da Internet', description: 'Lei 12.965/2014.' },
  {
    title: 'Lei Carolina Dieckmann',
    description: 'Lei 12.737/2012, sobre crimes ciberneticos.',
  },
  {
    title: 'Legislacao de propriedade intelectual de software',
    description: 'Lei 9.609/1998 (Lei do Software).',
  },
  { title: 'Lei de Direitos Autorais', description: 'Lei 9.610/1998.' },
  { title: 'Codigo Civil', description: 'Lei 10.406/2002.' },
  { title: 'Codigo de Defesa do Consumidor', description: 'Lei 8.078/1990.' },
  {
    title: 'Decreto do Comercio Eletronico',
    description: 'Decreto 7.962/2013.',
  },
  {
    title: 'Orientacoes da ANPD',
    description:
      'Guias e orientacoes da Autoridade Nacional de Protecao de Dados.',
  },
];

export class CreateRequirementsAndGovernanceTables1700000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stakeholders',
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
          { name: 'requirements', type: 'text', isNullable: true },
          { name: 'needs', type: 'text', isNullable: true },
          { name: 'expectations', type: 'text', isNullable: true },
          { name: 'observations', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'stakeholders',
      new TableForeignKey({
        name: 'fk_stakeholders_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'stakeholders',
      new TableIndex({
        name: 'idx_stakeholders_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'title', type: 'varchar', length: '200' },
          {
            name: 'category',
            type: 'varchar',
            length: '20',
            default: `'LEGAL'`,
          },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'project_requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'requirement_id', type: 'uuid', isNullable: true },
          { name: 'title', type: 'varchar', length: '200' },
          {
            name: 'category',
            type: 'varchar',
            length: '20',
            default: `'LEGAL'`,
          },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'observations', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'project_requirements',
      new TableForeignKey({
        name: 'fk_project_requirements_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'project_requirements',
      new TableForeignKey({
        name: 'fk_project_requirements_requirement',
        columnNames: ['requirement_id'],
        referencedTableName: 'requirements',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createIndex(
      'project_requirements',
      new TableIndex({
        name: 'idx_project_requirements_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'governance_committees',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'sgsi_scope_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '160', isNullable: true },
          { name: 'objective', type: 'text', isNullable: true },
          { name: 'responsibilities', type: 'text', isNullable: true },
          { name: 'observations', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'governance_committees',
      new TableForeignKey({
        name: 'fk_governance_committees_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        referencedTableName: 'sgsi_scopes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'governance_committees',
      new TableIndex({
        name: 'idx_governance_committees_sgsi_scope',
        columnNames: ['sgsi_scope_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'governance_members',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'governance_committee_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '160' },
          { name: 'job_role', type: 'varchar', length: '120' },
          { name: 'area', type: 'varchar', length: '120', isNullable: true },
          {
            name: 'committee_role',
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
      'governance_members',
      new TableForeignKey({
        name: 'fk_governance_members_committee',
        columnNames: ['governance_committee_id'],
        referencedTableName: 'governance_committees',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'governance_members',
      new TableIndex({
        name: 'idx_governance_members_committee',
        columnNames: ['governance_committee_id'],
      }),
    );

    for (const requirement of SEED_REQUIREMENTS) {
      await queryRunner.query(
        `INSERT INTO "requirements" ("title", "category", "description") VALUES ($1, $2, $3)`,
        [requirement.title, 'LEGAL', requirement.description],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('governance_members', true, true, true);
    await queryRunner.dropTable('governance_committees', true, true, true);
    await queryRunner.dropTable('project_requirements', true, true, true);
    await queryRunner.dropTable('requirements', true, true, true);
    await queryRunner.dropTable('stakeholders', true, true, true);
  }
}
