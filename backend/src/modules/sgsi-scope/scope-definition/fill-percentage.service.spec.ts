import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { ContextAspectType } from '../../../common/enums/context-aspect-type.enum';
import { type OrganizationEntity } from '../../organizations/entities/organization.entity';
import { type ProjectEntity } from '../../projects/entities/project.entity';
import { type ContextAspectEntity } from '../context/entities/context-aspect.entity';
import { type OrganizationContextEntity } from '../context/entities/organization-context.entity';
import { type DocumentControlEntity } from '../entities/document-control.entity';
import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type GovernanceCommitteeEntity } from '../requirements/entities/governance-committee.entity';
import { type GovernanceMemberEntity } from '../requirements/entities/governance-member.entity';
import { type ProjectRequirementEntity } from '../requirements/entities/project-requirement.entity';
import { type StakeholderEntity } from '../requirements/entities/stakeholder.entity';
import { type ScopeBenefitEntity } from './entities/scope-benefit.entity';
import { type ScopeCharacteristicEntity } from './entities/scope-characteristic.entity';
import { type ScopeDefinitionEntity } from './entities/scope-definition.entity';
import { FillPercentageService } from './fill-percentage.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    count: jest.fn<Promise<number>, [unknown?]>().mockResolvedValue(0),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const projectsRepository = buildRepositoryMock<ProjectEntity>();
  const organizationsRepository = buildRepositoryMock<OrganizationEntity>();
  const documentControlsRepository =
    buildRepositoryMock<DocumentControlEntity>();
  const organizationContextsRepository =
    buildRepositoryMock<OrganizationContextEntity>();
  const contextAspectsRepository = buildRepositoryMock<ContextAspectEntity>();
  const stakeholdersRepository = buildRepositoryMock<StakeholderEntity>();
  const projectRequirementsRepository =
    buildRepositoryMock<ProjectRequirementEntity>();
  const committeesRepository = buildRepositoryMock<GovernanceCommitteeEntity>();
  const membersRepository = buildRepositoryMock<GovernanceMemberEntity>();
  const scopeDefinitionsRepository =
    buildRepositoryMock<ScopeDefinitionEntity>();
  const characteristicsRepository =
    buildRepositoryMock<ScopeCharacteristicEntity>();
  const benefitsRepository = buildRepositoryMock<ScopeBenefitEntity>();

  const service = new FillPercentageService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    projectsRepository as unknown as Repository<ProjectEntity>,
    organizationsRepository as unknown as Repository<OrganizationEntity>,
    documentControlsRepository as unknown as Repository<DocumentControlEntity>,
    organizationContextsRepository as unknown as Repository<OrganizationContextEntity>,
    contextAspectsRepository as unknown as Repository<ContextAspectEntity>,
    stakeholdersRepository as unknown as Repository<StakeholderEntity>,
    projectRequirementsRepository as unknown as Repository<ProjectRequirementEntity>,
    committeesRepository as unknown as Repository<GovernanceCommitteeEntity>,
    membersRepository as unknown as Repository<GovernanceMemberEntity>,
    scopeDefinitionsRepository as unknown as Repository<ScopeDefinitionEntity>,
    characteristicsRepository as unknown as Repository<ScopeCharacteristicEntity>,
    benefitsRepository as unknown as Repository<ScopeBenefitEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    projectsRepository,
    organizationsRepository,
    documentControlsRepository,
    organizationContextsRepository,
    contextAspectsRepository,
    stakeholdersRepository,
    committeesRepository,
    membersRepository,
    scopeDefinitionsRepository,
  };
}

describe('FillPercentageService', () => {
  it('throws NotFoundException when the project does not exist', async () => {
    const { service, projectsRepository } = buildService();
    projectsRepository.findOne.mockResolvedValue(null);

    await expect(service.calculate('project-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws NotFoundException when the module has not been activated', async () => {
    const { service, projectsRepository, sgsiScopesRepository } =
      buildService();
    projectsRepository.findOne.mockResolvedValue({
      id: 'project-1',
      organizationId: 'org-1',
    } as ProjectEntity);
    sgsiScopesRepository.findOne.mockResolvedValue(null);

    await expect(service.calculate('project-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('never labels the result and reflects partial fill from real data', async () => {
    const {
      service,
      projectsRepository,
      sgsiScopesRepository,
      organizationsRepository,
      documentControlsRepository,
      organizationContextsRepository,
      contextAspectsRepository,
      committeesRepository,
    } = buildService();
    projectsRepository.findOne.mockResolvedValue({
      id: 'project-1',
      organizationId: 'org-1',
    } as ProjectEntity);
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    organizationsRepository.findOne.mockResolvedValue({
      business: 'Consultoria',
      mission: null,
      vision: null,
      values: [],
    } as unknown as OrganizationEntity);
    documentControlsRepository.findOne.mockResolvedValue({
      classification: 'Confidencial',
      version: null,
      documentDate: null,
      validUntil: null,
      preparedByUserId: null,
      approvedByUserId: null,
    } as DocumentControlEntity);
    organizationContextsRepository.findOne.mockResolvedValue(null);
    contextAspectsRepository.count.mockImplementation((args?: unknown) => {
      const { where } = args as { where: { type: ContextAspectType } };

      return Promise.resolve(where.type === ContextAspectType.EXTERNAL ? 1 : 0);
    });
    committeesRepository.findOne.mockResolvedValue(null);

    const result = await service.calculate('project-1');

    expect(result.label).toBe('Percentual de preenchimento do Escopometro');
    expect(result.passedChecks).toBeGreaterThan(0);
    expect(result.percentage).toBeLessThan(100);
    expect(result.percentage).toBeGreaterThan(0);
  });
});
