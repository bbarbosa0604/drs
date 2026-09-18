import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLogModule } from '../../audit-log/audit-log.module';
import { ProjectsModule } from '../../projects/projects.module';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { SgsiScopeVersionEntity } from '../entities/sgsi-scope-version.entity';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { SgsiScopeVersioningController } from './sgsi-scope-versioning.controller';
import { SgsiScopeVersioningService } from './sgsi-scope-versioning.service';

/** Slice 006 - versionamento (Task 027, PRD secao 20/44). */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      SgsiScopeVersionEntity,
      ProjectEntity,
    ]),
    ProjectsModule,
    AuditLogModule,
  ],
  controllers: [SgsiScopeVersioningController],
  providers: [SgsiScopeVersioningService],
})
export class SgsiScopeVersioningModule {}
