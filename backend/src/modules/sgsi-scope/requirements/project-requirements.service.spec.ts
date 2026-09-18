import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { RequirementCategory } from '../../../common/enums/requirement-category.enum';
import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type ProjectRequirementEntity } from './entities/project-requirement.entity';
import { type RequirementEntity } from './entities/requirement.entity';
import { ProjectRequirementsService } from './project-requirements.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    remove: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const requirementsRepository = buildRepositoryMock<RequirementEntity>();
  const projectRequirementsRepository =
    buildRepositoryMock<ProjectRequirementEntity>();

  const service = new ProjectRequirementsService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    requirementsRepository as unknown as Repository<RequirementEntity>,
    projectRequirementsRepository as unknown as Repository<ProjectRequirementEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    requirementsRepository,
    projectRequirementsRepository,
  };
}

describe('ProjectRequirementsService', () => {
  it('lists the global library alongside the project selected/custom requirements', async () => {
    const {
      service,
      sgsiScopesRepository,
      requirementsRepository,
      projectRequirementsRepository,
    } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    requirementsRepository.find.mockResolvedValue([
      { id: 'req-lgpd', title: 'LGPD' } as RequirementEntity,
    ]);
    projectRequirementsRepository.find.mockResolvedValue([
      { id: 'pr-1', title: 'Custom requirement' } as ProjectRequirementEntity,
    ]);

    const result = await service.list('project-1');

    expect(result.library).toHaveLength(1);
    expect(result.selected).toHaveLength(1);
  });

  it('rejects creation without requirementId or title', async () => {
    const { service, sgsiScopesRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await expect(service.create('project-1', {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws NotFoundException when requirementId does not exist in the library', async () => {
    const { service, sgsiScopesRepository, requirementsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    requirementsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create('project-1', { requirementId: 'missing-req' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('denormalizes title/category/description from the library when requirementId is given', async () => {
    const {
      service,
      sgsiScopesRepository,
      requirementsRepository,
      projectRequirementsRepository,
    } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    requirementsRepository.findOne.mockResolvedValue({
      id: 'req-lgpd',
      title: 'LGPD',
      category: RequirementCategory.LEGAL,
      description: 'Lei Geral de Protecao de Dados.',
    } as RequirementEntity);

    await service.create('project-1', { requirementId: 'req-lgpd' });

    expect(projectRequirementsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        requirementId: 'req-lgpd',
        title: 'LGPD',
        category: RequirementCategory.LEGAL,
        description: 'Lei Geral de Protecao de Dados.',
      }),
    );
  });

  it('allows a custom requirement without a requirementId', async () => {
    const { service, sgsiScopesRepository, projectRequirementsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.create('project-1', { title: 'Norma interna especifica' });

    expect(projectRequirementsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        requirementId: null,
        title: 'Norma interna especifica',
      }),
    );
  });

  it('allows duplicating the same requirement in a project (no uniqueness enforced)', async () => {
    const {
      service,
      sgsiScopesRepository,
      requirementsRepository,
      projectRequirementsRepository,
    } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    requirementsRepository.findOne.mockResolvedValue({
      id: 'req-lgpd',
      title: 'LGPD',
      category: RequirementCategory.LEGAL,
      description: null,
    } as RequirementEntity);

    await service.create('project-1', { requirementId: 'req-lgpd' });
    await service.create('project-1', { requirementId: 'req-lgpd' });

    expect(projectRequirementsRepository.save).toHaveBeenCalledTimes(2);
  });
});
