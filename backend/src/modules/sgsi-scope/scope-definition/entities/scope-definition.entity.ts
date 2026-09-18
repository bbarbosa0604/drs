import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';

/** Etapa 4.1-4.3 (PRD secao 11) — criado sob demanda no primeiro autosave. */
@Entity({ name: 'scope_definitions' })
export class ScopeDefinitionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_definitions_sgsi_scope', { unique: true })
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  /** 11.1 - Declaracao formal do escopo. */
  @Column({ name: 'formal_declaration', type: 'text', nullable: true })
  formalDeclaration!: string | null;

  /** 11.2 - Fundamentacao executiva. */
  @Column({ name: 'executive_justification', type: 'text', nullable: true })
  executiveJustification!: string | null;

  /**
   * 11.3 - Descricao detalhada (editor de conteudo rico). Mesmo formato de
   * `OrganizationContext.history` (Task 012): `{ html }` ja sanitizado.
   */
  @Column({ name: 'detailed_description', type: 'jsonb', nullable: true })
  detailedDescription!: { html: string } | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
