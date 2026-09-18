import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '../../projects/projects.module';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { ScopeAssetEntity } from './entities/scope-asset.entity';
import { ScopeApprovalEntity } from './entities/scope-approval.entity';
import { ScopeEmployeeGroupEntity } from './entities/scope-employee-group.entity';
import { ScopeLocationEntity } from './entities/scope-location.entity';
import { ScopeProviderEntity } from './entities/scope-provider.entity';
import { ScopeRevisionEntity } from './entities/scope-revision.entity';
import { LimitsController } from './limits.controller';
import { LimitsService } from './limits.service';

/** Slice 005 - Limites, Recursos & Aprovacao (PRD secao 14, Task 023). */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      ScopeLocationEntity,
      ScopeEmployeeGroupEntity,
      ScopeAssetEntity,
      ScopeProviderEntity,
      ScopeApprovalEntity,
      ScopeRevisionEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [LimitsController],
  providers: [LimitsService],
})
export class LimitsModule {}
