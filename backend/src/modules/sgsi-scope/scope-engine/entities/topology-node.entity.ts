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
import { TopologyNodeType } from '../../../../common/enums/topology-node-type.enum';
import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';

/** Etapa 6.1 - Topologia, cadastro de nos (PRD secao 13.1). */
@Entity({ name: 'topology_nodes' })
export class TopologyNodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_topology_nodes_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 30 })
  type!: TopologyNodeType;

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
