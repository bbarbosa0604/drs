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

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';
import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';

/** Etapa 7.4 - Prestadores de servico (PRD secao 14.4). */
@Entity({ name: 'scope_providers' })
export class ScopeProviderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_providers_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ name: 'provider_name', type: 'varchar', length: 160 })
  providerName!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  service!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  /** Ausente = "nao classificado" (nunca inferida automaticamente, PRD secao 12/44). */
  @Column({ type: 'varchar', length: 20, nullable: true })
  classification!: ScopeClassification | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
