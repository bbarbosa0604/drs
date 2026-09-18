import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { ProjectsModule } from '../../projects/projects.module';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { ContextAspectEntity } from '../context/entities/context-aspect.entity';
import { OrganizationContextEntity } from '../context/entities/organization-context.entity';
import { DocumentControlEntity } from '../entities/document-control.entity';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { GovernanceCommitteeEntity } from '../requirements/entities/governance-committee.entity';
import { GovernanceMemberEntity } from '../requirements/entities/governance-member.entity';
import { ProjectRequirementEntity } from '../requirements/entities/project-requirement.entity';
import { StakeholderEntity } from '../requirements/entities/stakeholder.entity';
import { ScopeBenefitEntity } from './entities/scope-benefit.entity';
import { ScopeCharacteristicEntity } from './entities/scope-characteristic.entity';
import { ScopeDefinitionEntity } from './entities/scope-definition.entity';
import { FillPercentageController } from './fill-percentage.controller';
import { FillPercentageService } from './fill-percentage.service';
import { ScopeDefinitionController } from './scope-definition.controller';
import { ScopeDefinitionService } from './scope-definition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SgsiScopeEntity,
      ProjectEntity,
      OrganizationEntity,
      DocumentControlEntity,
      OrganizationContextEntity,
      ContextAspectEntity,
      StakeholderEntity,
      ProjectRequirementEntity,
      GovernanceCommitteeEntity,
      GovernanceMemberEntity,
      ScopeDefinitionEntity,
      ScopeCharacteristicEntity,
      ScopeBenefitEntity,
    ]),
    ProjectsModule,
  ],
  controllers: [ScopeDefinitionController, FillPercentageController],
  providers: [ScopeDefinitionService, FillPercentageService],
})
export class ScopeDefinitionModule {}
