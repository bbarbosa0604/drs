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

import { ContextAspectType } from '../../../../common/enums/context-aspect-type.enum';
import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';

/** Etapas 2.3/2.4 - Questoes externas/internas (PRD secao 9.3/9.4). */
@Entity({ name: 'context_aspects' })
export class ContextAspectEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_context_aspects_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 20 })
  type!: ContextAspectType;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
