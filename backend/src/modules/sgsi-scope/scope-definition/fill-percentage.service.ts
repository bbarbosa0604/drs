import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextAspectType } from '../../../common/enums/context-aspect-type.enum';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { ContextAspectEntity } from '../context/entities/context-aspect.entity';
import { OrganizationContextEntity } from '../context/entities/organization-context.entity';
import { SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { DocumentControlEntity } from '../entities/document-control.entity';
import { GovernanceCommitteeEntity } from '../requirements/entities/governance-committee.entity';
import { GovernanceMemberEntity } from '../requirements/entities/governance-member.entity';
import { ProjectRequirementEntity } from '../requirements/entities/project-requirement.entity';
import { StakeholderEntity } from '../requirements/entities/stakeholder.entity';
import { ScopeBenefitEntity } from './entities/scope-benefit.entity';
import { ScopeCharacteristicEntity } from './entities/scope-characteristic.entity';
import { ScopeDefinitionEntity } from './entities/scope-definition.entity';
import {
  calculateFillPercentage,
  type FillPercentageResult,
} from './fill-percentage.util';

@Injectable()
export class FillPercentageService {
  constructor(
    @InjectRepository(SgsiScopeEntity)
    private readonly sgsiScopesRepository: Repository<SgsiScopeEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly organizationsRepository: Repository<OrganizationEntity>,
    @InjectRepository(DocumentControlEntity)
    private readonly documentControlsRepository: Repository<DocumentControlEntity>,
    @InjectRepository(OrganizationContextEntity)
    private readonly organizationContextsRepository: Repository<OrganizationContextEntity>,
    @InjectRepository(ContextAspectEntity)
    private readonly contextAspectsRepository: Repository<ContextAspectEntity>,
    @InjectRepository(StakeholderEntity)
    private readonly stakeholdersRepository: Repository<StakeholderEntity>,
    @InjectRepository(ProjectRequirementEntity)
    private readonly projectRequirementsRepository: Repository<ProjectRequirementEntity>,
    @InjectRepository(GovernanceCommitteeEntity)
    private readonly committeesRepository: Repository<GovernanceCommitteeEntity>,
    @InjectRepository(GovernanceMemberEntity)
    private readonly membersRepository: Repository<GovernanceMemberEntity>,
    @InjectRepository(ScopeDefinitionEntity)
    private readonly scopeDefinitionsRepository: Repository<ScopeDefinitionEntity>,
    @InjectRepository(ScopeCharacteristicEntity)
    private readonly characteristicsRepository: Repository<ScopeCharacteristicEntity>,
    @InjectRepository(ScopeBenefitEntity)
    private readonly benefitsRepository: Repository<ScopeBenefitEntity>,
  ) {}

  async calculate(projectId: string): Promise<FillPercentageResult> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    const sgsiScope = await this.sgsiScopesRepository.findOne({
      where: { projectId },
    });

    if (!sgsiScope) {
      throw new NotFoundException(
        'SGSI Scope module has not been activated for this project.',
      );
    }

    const sgsiScopeId = sgsiScope.id;

    const [
      organization,
      documentControl,
      organizationContext,
      externalAspectCount,
      internalAspectCount,
      stakeholderCount,
      projectRequirementCount,
      committee,
      characteristicCount,
      benefitCount,
      scopeDefinition,
    ] = await Promise.all([
      this.organizationsRepository.findOne({
        where: { id: project.organizationId },
      }),
      this.documentControlsRepository.findOne({ where: { sgsiScopeId } }),
      this.organizationContextsRepository.findOne({ where: { sgsiScopeId } }),
      this.contextAspectsRepository.count({
        where: { sgsiScopeId, type: ContextAspectType.EXTERNAL },
      }),
      this.contextAspectsRepository.count({
        where: { sgsiScopeId, type: ContextAspectType.INTERNAL },
      }),
      this.stakeholdersRepository.count({ where: { sgsiScopeId } }),
      this.projectRequirementsRepository.count({ where: { sgsiScopeId } }),
      this.committeesRepository.findOne({ where: { sgsiScopeId } }),
      this.characteristicsRepository.count({ where: { sgsiScopeId } }),
      this.benefitsRepository.count({ where: { sgsiScopeId } }),
      this.scopeDefinitionsRepository.findOne({ where: { sgsiScopeId } }),
    ]);

    const memberCount = committee
      ? await this.membersRepository.count({
          where: { governanceCommitteeId: committee.id },
        })
      : 0;

    return calculateFillPercentage({
      documentControlClassification: Boolean(documentControl?.classification),
      documentControlVersion: Boolean(documentControl?.version),
      documentControlDocumentDate: Boolean(documentControl?.documentDate),
      documentControlValidUntil: Boolean(documentControl?.validUntil),
      documentControlPreparedBy: Boolean(documentControl?.preparedByUserId),
      documentControlApprovedBy: Boolean(documentControl?.approvedByUserId),
      contextHistory: Boolean(organizationContext?.history?.html),
      directionBusiness: Boolean(organization?.business),
      directionMission: Boolean(organization?.mission),
      directionVision: Boolean(organization?.vision),
      directionValues: Boolean(organization && organization.values.length > 0),
      hasExternalContextAspect: externalAspectCount > 0,
      hasInternalContextAspect: internalAspectCount > 0,
      hasStakeholder: stakeholderCount > 0,
      hasProjectRequirement: projectRequirementCount > 0,
      governanceCommitteeName: Boolean(committee?.name),
      hasGovernanceMember: memberCount > 0,
      scopeFormalDeclaration: Boolean(scopeDefinition?.formalDeclaration),
      scopeExecutiveJustification: Boolean(
        scopeDefinition?.executiveJustification,
      ),
      scopeDetailedDescription: Boolean(
        scopeDefinition?.detailedDescription?.html,
      ),
      hasScopeCharacteristic: characteristicCount > 0,
      hasScopeBenefit: benefitCount > 0,
    });
  }
}
