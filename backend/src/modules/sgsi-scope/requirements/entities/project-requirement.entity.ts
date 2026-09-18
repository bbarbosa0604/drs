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

import { RequirementCategory } from '../../../../common/enums/requirement-category.enum';
import { SgsiScopeEntity } from '../../entities/sgsi-scope.entity';
import { RequirementEntity } from './requirement.entity';

/**
 * Requisito aplicado a um projeto: selecionado da biblioteca global
 * (`requirement_id` preenchido) ou customizado (`requirement_id` nulo,
 * digitado livremente). Campos denormalizados (`title`/`category`/
 * `description`) porque um requisito customizado nao tem linha na
 * biblioteca, e um selecionado da biblioteca pode ser editado localmente
 * sem alterar a biblioteca global. Duplicar o mesmo requisito no mesmo
 * projeto e permitido (decisao explicita do especialista, PRD/Task 015).
 */
@Entity({ name: 'project_requirements' })
export class ProjectRequirementEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_project_requirements_sgsi_scope')
  @Column({ name: 'sgsi_scope_id', type: 'uuid' })
  sgsiScopeId!: string;

  @ManyToOne(() => SgsiScopeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sgsi_scope_id' })
  sgsiScope!: SgsiScopeEntity;

  @Column({ name: 'requirement_id', type: 'uuid', nullable: true })
  requirementId!: string | null;

  @ManyToOne(() => RequirementEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'requirement_id' })
  requirement!: RequirementEntity | null;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: RequirementCategory.LEGAL,
  })
  category!: RequirementCategory;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
