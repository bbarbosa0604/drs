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

/**
 * Etapa 2.1 - Historico (PRD secao 9.1). `history` guarda um envelope JSON
 * `{ html: string }` com o HTML ja sanitizado (ver `sanitizeRichTextHtml`) —
 * o schema exato do editor de conteudo rico (TipTap/ProseMirror) sera
 * decidido na Task 014 (frontend); este backend so precisa persistir e
 * devolver o conteudo sanitizado, nao interpretar a arvore do editor.
 */
@Entity({ name: 'organization_contexts' })
export class OrganizationContextEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_organization_contexts_sgsi_scope', { unique: true })
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'jsonb', nullable: true })
  history!: { html: string } | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
