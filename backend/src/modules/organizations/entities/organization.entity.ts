import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'organizations' })
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  segment!: string | null;

  @Column({
    name: 'employee_count',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  employeeCount!: string | null;

  @Column({
    name: 'geographic_scope',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  geographicScope!: string | null;

  @Column({ name: 'products_services', type: 'text', nullable: true })
  productsServices!: string | null;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl!: string | null;

  @Column({ name: 'institutional_history', type: 'text', nullable: true })
  institutionalHistory!: string | null;

  @Column({ type: 'text', nullable: true })
  business!: string | null;

  @Column({ type: 'text', nullable: true })
  mission!: string | null;

  @Column({ type: 'text', nullable: true })
  vision!: string | null;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  values!: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
