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

/**
 * Etapa 7.6 - Revisoes (PRD secao 14.6): "historico contendo versao, data,
 * responsavel, descricao da alteracao" - um log de entradas, nao uma lista
 * editavel. So cria/lista (sem update/delete), mesmo espirito de
 * `AuditLog`. Versionamento completo com protecao de sobrescrita e a Task
 * 027; isto aqui e so o registro basico por etapa.
 */
@Entity({ name: 'scope_revisions' })
export class ScopeRevisionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_scope_revisions_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ type: 'varchar', length: 40 })
  version!: string;

  @Column({ name: 'revised_at', type: 'date' })
  revisedAt!: string;

  @Column({ type: 'varchar', length: 160 })
  responsible!: string;

  @Column({ name: 'change_description', type: 'text' })
  changeDescription!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
