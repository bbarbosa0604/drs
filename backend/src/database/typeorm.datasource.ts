import 'dotenv/config';

import { join } from 'node:path';

import { DataSource } from 'typeorm';

import { AuditLogEntity } from '../modules/audit-log/entities/audit-log.entity';
import { ModuleInstanceEntity } from '../modules/module-instances/entities/module-instance.entity';
import { OrganizationMemberEntity } from '../modules/organizations/entities/organization-member.entity';
import { OrganizationEntity } from '../modules/organizations/entities/organization.entity';
import { ProjectMemberEntity } from '../modules/projects/entities/project-member.entity';
import { ProjectEntity } from '../modules/projects/entities/project.entity';
import { UserEntity } from '../modules/users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'backend',
  entities: [
    UserEntity,
    OrganizationEntity,
    OrganizationMemberEntity,
    ProjectEntity,
    ProjectMemberEntity,
    ModuleInstanceEntity,
    AuditLogEntity,
  ],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
