import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SgsiScopeVersionStatus } from '../../../common/enums/sgsi-scope-version-status.enum';
import { SgsiScopeEntity } from './sgsi-scope.entity';

/**
 * Raiz do versionamento (PRD secao 20). Nesta task (011) so a primeira versao
 * rascunho e criada na ativacao; a logica de gerar nova versao ao editar
 * apos aprovacao fica para a Task 027.
 */
@Entity({ name: 'sgsi_scope_versions' })
export class SgsiScopeVersionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ name: 'version_number', type: 'int' })
  versionNumber!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: SgsiScopeVersionStatus.DRAFT,
  })
  status!: SgsiScopeVersionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
