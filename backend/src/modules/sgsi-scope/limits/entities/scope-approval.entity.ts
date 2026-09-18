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
 * Etapa 7.5 - Aprovacao (PRD secao 14.5). Registro unico por SgsiScope (nao
 * uma lista) - o mesmo padrao 1:1 de `ScopeDefinition` (Task 016): criado sob
 * demanda no primeiro autosave, sem responsavel/data obrigatorios no MVP
 * (PRD - casos de erro da Task 023: permitido incompleto, so reduz o
 * percentual de preenchimento).
 */
@Entity({ name: 'scope_approvals' })
export class ScopeApprovalEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_approvals_sgsi_scope', { unique: true })
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 120, nullable: true })
  method!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  platform!: string | null;

  @Column({ name: 'approval_text', type: 'text', nullable: true })
  approvalText!: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  responsible!: string | null;

  @Column({ name: 'approved_at', type: 'date', nullable: true })
  approvedAt!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
