import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RequirementCategory } from '../../../../common/enums/requirement-category.enum';

/**
 * Biblioteca global de requisitos legais/regulatorios/contratuais (PRD secao
 * 10.2/32) — decisao confirmada com o Bruno: uma tabela global seedada,
 * mantida pelo DSR Admin, nao uma copia por projeto. Cada projeto seleciona
 * quais se aplicam via `ProjectRequirementEntity`.
 */
@Entity({ name: 'requirements' })
export class RequirementEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
