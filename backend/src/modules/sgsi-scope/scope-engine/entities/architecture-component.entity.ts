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

/** Etapa 6.2 - Arquitetura, cadastro de componentes (PRD secao 13.2). */
@Entity({ name: 'architecture_components' })
export class ArchitectureComponentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_architecture_components_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  layer!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  /** Ausente = "nao classificado" (nunca inferido automaticamente, PRD secao 12/44). */
  @Column({ type: 'varchar', length: 20, nullable: true })
  classification!: ScopeClassification | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
