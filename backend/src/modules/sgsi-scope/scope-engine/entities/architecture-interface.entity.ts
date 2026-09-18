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
import { ArchitectureComponentEntity } from './architecture-component.entity';

/**
 * Etapa 6.2 - Arquitetura, cadastro de interfaces (PRD secao 13.2). `onDelete:
 * 'RESTRICT'` e defesa em profundidade; o bloqueio com mensagem clara
 * acontece antes, no service (`ArchitectureService.removeComponent`).
 */
@Entity({ name: 'architecture_interfaces' })
export class ArchitectureInterfaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_architecture_interfaces_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Index('idx_architecture_interfaces_from_component')
  @Column({ name: 'from_component_id', type: 'uuid' })
  fromComponentId!: string;

  @ManyToOne(() => ArchitectureComponentEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'from_component_id' })
  fromComponent!: ArchitectureComponentEntity;

  @Index('idx_architecture_interfaces_to_component')
  @Column({ name: 'to_component_id', type: 'uuid' })
  toComponentId!: string;

  @ManyToOne(() => ArchitectureComponentEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'to_component_id' })
  toComponent!: ArchitectureComponentEntity;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
