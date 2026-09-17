import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLogEntity } from '../audit-log/entities/audit-log.entity';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { ProjectMemberEntity } from './entities/project-member.entity';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsAccessService } from './projects-access.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectMemberEntity,
      AuditLogEntity,
    ]),
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsAccessService, ProjectsService],
  exports: [ProjectsAccessService],
})
export class ProjectsModule {}
