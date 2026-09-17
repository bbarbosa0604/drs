import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ModuleKey } from '../../../common/enums/module-key.enum';
import { ProjectEntity } from '../../projects/entities/project.entity';

@Entity({ name: 'module_instances' })
@Index('idx_module_instances_project_module', ['projectId', 'moduleKey'], {
  unique: true,
})
export class ModuleInstanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @Column({ name: 'module_key', type: 'varchar', length: 40 })
  moduleKey!: ModuleKey;

  @CreateDateColumn({ name: 'activated_at', type: 'timestamptz' })
  activatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
