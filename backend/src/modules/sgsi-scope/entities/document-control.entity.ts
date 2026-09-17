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

import { UserEntity } from '../../users/entities/user.entity';
import { SgsiScopeEntity } from './sgsi-scope.entity';

/** Etapa 1.2 do Escopometro (PRD secao 8.2). */
@Entity({ name: 'document_controls' })
export class DocumentControlEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_document_controls_sgsi_scope', { unique: true })
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 80, nullable: true })
  classification!: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  version!: string | null;

  @Column({ name: 'document_date', type: 'date', nullable: true })
  documentDate!: string | null;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil!: string | null;

  @Column({ name: 'prepared_by_user_id', type: 'uuid', nullable: true })
  preparedByUserId!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'prepared_by_user_id' })
  preparedByUser!: UserEntity | null;

  @Column({ name: 'approved_by_user_id', type: 'uuid', nullable: true })
  approvedByUserId!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approvedByUser!: UserEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
