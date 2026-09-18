import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { type ScopeAssetEntity } from './entities/scope-asset.entity';
import { type ScopeApprovalEntity } from './entities/scope-approval.entity';
import { type ScopeEmployeeGroupEntity } from './entities/scope-employee-group.entity';
import { type ScopeLocationEntity } from './entities/scope-location.entity';
import { type ScopeProviderEntity } from './entities/scope-provider.entity';
import { type ScopeRevisionEntity } from './entities/scope-revision.entity';
import { LimitsService } from './limits.service';

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
  const locationsRepository = buildRepositoryMock<ScopeLocationEntity>();
  const employeeGroupsRepository =
    buildRepositoryMock<ScopeEmployeeGroupEntity>();
  const assetsRepository = buildRepositoryMock<ScopeAssetEntity>();
  const providersRepository = buildRepositoryMock<ScopeProviderEntity>();
  const approvalsRepository = buildRepositoryMock<ScopeApprovalEntity>();
  const revisionsRepository = buildRepositoryMock<ScopeRevisionEntity>();

  const service = new LimitsService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    locationsRepository as unknown as Repository<ScopeLocationEntity>,
    employeeGroupsRepository as unknown as Repository<ScopeEmployeeGroupEntity>,
    assetsRepository as unknown as Repository<ScopeAssetEntity>,
    providersRepository as unknown as Repository<ScopeProviderEntity>,
    approvalsRepository as unknown as Repository<ScopeApprovalEntity>,
    revisionsRepository as unknown as Repository<ScopeRevisionEntity>,
  );

  return {
    service,
    sgsiScopesRepository,
    locationsRepository,
    employeeGroupsRepository,
    assetsRepository,
    providersRepository,
    approvalsRepository,
    revisionsRepository,
  };
}

describe('LimitsService', () => {
  it('creates a location scoped to the project SgsiScope, without forcing a classification', async () => {
    const { service, sgsiScopesRepository, locationsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createLocation('project-1', { name: 'Matriz' });

    expect(locationsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        name: 'Matriz',
        classification: null,
      }),
    );
  });

  it('throws NotFoundException when updating an asset from another scope', async () => {
    const { service, sgsiScopesRepository, assetsRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    assetsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateAsset('project-1', 'other-scope-asset', { assetName: 'x' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates the approval lazily on the first save, allowing missing fields (MVP)', async () => {
    const { service, sgsiScopesRepository, approvalsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    approvalsRepository.findOne.mockResolvedValue(null);

    await service.updateApproval('project-1', { method: 'Reuniao' });

    expect(approvalsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        method: 'Reuniao',
        responsible: null,
        approvedAt: null,
      }),
    );
  });

  it('updates the existing approval in place instead of creating a second row', async () => {
    const { service, sgsiScopesRepository, approvalsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    approvalsRepository.findOne.mockResolvedValue({
      id: 'approval-1',
      sgsiScopeId: 'sgsi-scope-1',
      method: 'Reuniao',
    } as ScopeApprovalEntity);

    await service.updateApproval('project-1', { responsible: 'Bruno' });

    expect(approvalsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'approval-1', responsible: 'Bruno' }),
    );
  });

  it('creates a revision entry scoped to the project SgsiScope', async () => {
    const { service, sgsiScopesRepository, revisionsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);

    await service.createRevision('project-1', {
      version: '1.1',
      revisedAt: '2026-01-01',
      responsible: 'Bruno',
      changeDescription: 'Ajuste de escopo',
    });

    expect(revisionsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ sgsiScopeId: 'sgsi-scope-1', version: '1.1' }),
    );
  });
});
