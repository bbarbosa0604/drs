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

/** Etapa 7.1 - Localidades (PRD secao 14.1). */
@Entity({ name: 'scope_locations' })
export class ScopeLocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_locations_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address!: string | null;

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
