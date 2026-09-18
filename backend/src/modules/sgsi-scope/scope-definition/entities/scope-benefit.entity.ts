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

/** Etapa 4.5 - Lista dinamica de beneficios/resultados esperados (PRD secao 11.5). */
@Entity({ name: 'scope_benefits' })
export class ScopeBenefitEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_benefits_sgsi_scope')
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
