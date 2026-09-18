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
import { ValueChainCategory } from '../../../../common/enums/value-chain-category.enum';
import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';

/** Etapa 5 - Cadeia de Valor (PRD secao 12). */
@Entity({ name: 'value_chain_blocks' })
export class ValueChainBlockEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_value_chain_blocks_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    name: 'responsible_area',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  responsibleArea!: string | null;

  @Column({ type: 'varchar', length: 30 })
  category!: ValueChainCategory;

  /** Ausente = "nao classificado" (nunca inferido automaticamente, PRD secao 12/44). */
  @Column({ type: 'varchar', length: 20, nullable: true })
  classification!: ScopeClassification | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
