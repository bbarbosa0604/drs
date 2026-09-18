import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';

/** Etapa 4.4 - Lista dinamica de caracteristicas do escopo (PRD secao 11.4). */
@Entity({ name: 'scope_characteristics' })
export class ScopeCharacteristicEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_characteristics_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'text' })
  description!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
