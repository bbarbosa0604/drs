import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ModuleInstanceEntity } from '../../module-instances/entities/module-instance.entity';
import { ProjectEntity } from '../../projects/entities/project.entity';

@Entity({ name: 'sgsi_scopes' })
export class SgsiScopeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_sgsi_scopes_project', { unique: true })
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @Index('idx_sgsi_scopes_module_instance', { unique: true })
  @Column({ name: 'module_instance_id', type: 'uuid' })
  moduleInstanceId!: string;

  @ManyToOne(() => ModuleInstanceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_instance_id' })
  moduleInstance!: ModuleInstanceEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
