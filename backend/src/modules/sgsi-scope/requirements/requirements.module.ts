import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '../../projects/projects.module';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { GovernanceCommitteeEntity } from './entities/governance-committee.entity';
import { GovernanceMemberEntity } from './entities/governance-member.entity';
import { ProjectRequirementEntity } from './entities/project-requirement.entity';
import { RequirementEntity } from './entities/requirement.entity';
import { StakeholderEntity } from './entities/stakeholder.entity';
import { GovernanceController } from './governance.controller';
import { GovernanceService } from './governance.service';
import { ProjectRequirementsController } from './project-requirements.controller';
import { ProjectRequirementsService } from './project-requirements.service';
import { RequirementsLibraryController } from './requirements-library.controller';
import { RequirementsLibraryService } from './requirements-library.service';
import { StakeholdersController } from './stakeholders.controller';
import { StakeholdersService } from './stakeholders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      StakeholderEntity,
      RequirementEntity,
      ProjectRequirementEntity,
      GovernanceCommitteeEntity,
      GovernanceMemberEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [
    StakeholdersController,
    RequirementsLibraryController,
    ProjectRequirementsController,
    GovernanceController,
  ],
  providers: [
    StakeholdersService,
    RequirementsLibraryService,
    ProjectRequirementsService,
    GovernanceService,
  ],
})
export class RequirementsModule {}
