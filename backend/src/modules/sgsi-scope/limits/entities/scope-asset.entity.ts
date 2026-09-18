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

/** Etapa 7.3 - Ativos tecnologicos (PRD secao 14.3). */
@Entity({ name: 'scope_assets' })
export class ScopeAssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_assets_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ name: 'asset_name', type: 'varchar', length: 160 })
  assetName!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  category!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  responsible!: string | null;

  /** Ausente = "nao classificado" (nunca inferida automaticamente, PRD secao 12/44). */
  @Column({ type: 'varchar', length: 20, nullable: true })
  classification!: ScopeClassification | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
