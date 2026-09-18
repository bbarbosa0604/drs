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

import { GovernanceCommitteeEntity } from './governance-committee.entity';

/** Etapa 3.3 - Membros do comite CGSI (PRD secao 10.3). */
@Entity({ name: 'governance_members' })
export class GovernanceMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_governance_members_committee')
  @Column({ name: 'governance_committee_id', type: 'uuid' })
  governanceCommitteeId!: string;

  @ManyToOne(() => GovernanceCommitteeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'governance_committee_id' })
  governanceCommittee!: GovernanceCommitteeEntity;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  /** "Funcao" no PRD — obrigatoria (caso de borda: "membro sem funcao -> 400"). */
  @Column({ name: 'job_role', type: 'varchar', length: 120 })
  jobRole!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  area!: string | null;

  /** "Papel no comite" (ex.: Presidente, Secretario). */
  @Column({
    name: 'committee_role',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  committeeRole!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
