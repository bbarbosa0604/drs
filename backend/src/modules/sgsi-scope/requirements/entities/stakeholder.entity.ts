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

/** Etapa 3.1 - Partes interessadas (PRD secao 10.1). */
@Entity({ name: 'stakeholders' })
export class StakeholderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_stakeholders_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  requirements!: string | null;

  @Column({ type: 'text', nullable: true })
  needs!: string | null;

  @Column({ type: 'text', nullable: true })
  expectations!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
