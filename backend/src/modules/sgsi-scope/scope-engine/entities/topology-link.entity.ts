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
import { TopologyNodeEntity } from './topology-node.entity';

/**
 * Etapa 6.1 - Topologia, cadastro de conexoes (PRD secao 13.1). `onDelete:
 * 'RESTRICT'` e defesa em profundidade; o bloqueio com mensagem clara
 * acontece antes, no service (`TopologyService.removeNode`).
 */
@Entity({ name: 'topology_links' })
export class TopologyLinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_topology_links_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Index('idx_topology_links_from_node')
  @Column({ name: 'from_node_id', type: 'uuid' })
  fromNodeId!: string;

  @ManyToOne(() => TopologyNodeEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_node_id' })
  fromNode!: TopologyNodeEntity;

  @Index('idx_topology_links_to_node')
  @Column({ name: 'to_node_id', type: 'uuid' })
  toNodeId!: string;

  @ManyToOne(() => TopologyNodeEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_node_id' })
  toNode!: TopologyNodeEntity;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'link_type', type: 'varchar', length: 120, nullable: true })
  linkType!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
