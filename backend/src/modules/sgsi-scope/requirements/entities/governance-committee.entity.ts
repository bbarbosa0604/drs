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

/** Etapa 3.3 - Governanca/CGSI, dados do comite (PRD secao 10.3). */
@Entity({ name: 'governance_committees' })
export class GovernanceCommitteeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_governance_committees_sgsi_scope', { unique: true })
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 160, nullable: true })
  name!: string | null;

  @Column({ type: 'text', nullable: true })
  objective!: string | null;

  @Column({ type: 'text', nullable: true })
  responsibilities!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
