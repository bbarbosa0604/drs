import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GeneratedDocumentKind } from '../../../common/enums/generated-document-kind.enum';
import { SgsiScopeEntity } from '../../sgsi-scope/entities/sgsi-scope.entity';

/** PRD secao 17/21/44 - registro do documento gerado, desacoplado da geracao em si. */
@Entity({ name: 'generated_documents' })
export class GeneratedDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_generated_documents_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 30 })
  kind!: GeneratedDocumentKind;

  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName!: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 160 })
  mimeType!: string;

  /** Chave no storage (Task 026: filesystem local por tras de uma interface S3-compativel). */
  @Column({ name: 'storage_key', type: 'varchar', length: 255 })
  storageKey!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
