import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { ModuleKey } from '../../common/enums/module-key.enum';
import { SgsiScopeVersionStatus } from '../../common/enums/sgsi-scope-version-status.enum';
import { type ModuleInstanceEntity } from '../module-instances/entities/module-instance.entity';
import { type DocumentControlEntity } from './entities/document-control.entity';
import { type SgsiScopeVersionEntity } from './entities/sgsi-scope-version.entity';
import { type SgsiScopeEntity } from './entities/sgsi-scope.entity';
import { SgsiScopeService } from './sgsi-scope.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const moduleInstancesRepository = buildRepositoryMock<ModuleInstanceEntity>();
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const sgsiScopeVersionsRepository =
    buildRepositoryMock<SgsiScopeVersionEntity>();
  const documentControlsRepository =
    buildRepositoryMock<DocumentControlEntity>();

  const service = new SgsiScopeService(
    moduleInstancesRepository as unknown as Repository<ModuleInstanceEntity>,
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    sgsiScopeVersionsRepository as unknown as Repository<SgsiScopeVersionEntity>,
    documentControlsRepository as unknown as Repository<DocumentControlEntity>,
  );

  return {
    service,
    moduleInstancesRepository,
    sgsiScopesRepository,
    sgsiScopeVersionsRepository,
    documentControlsRepository,
  };
}

describe('SgsiScopeService', () => {
  it('activates the module, creating ModuleInstance, SgsiScope, first version and empty DocumentControl', async () => {
    const {
      service,
      moduleInstancesRepository,
      sgsiScopesRepository,
      sgsiScopeVersionsRepository,
      documentControlsRepository,
    } = buildService();
    moduleInstancesRepository.findOne.mockResolvedValue(null);
    moduleInstancesRepository.save.mockResolvedValue({
      id: 'module-instance-1',
    } as ModuleInstanceEntity);
    sgsiScopesRepository.save.mockResolvedValue({
      id: 'sgsi-scope-1',
      projectId: 'project-1',
      moduleInstanceId: 'module-instance-1',
    } as SgsiScopeEntity);
    sgsiScopeVersionsRepository.findOne.mockResolvedValue({
      versionNumber: 1,
      status: SgsiScopeVersionStatus.DRAFT,
    } as SgsiScopeVersionEntity);
    documentControlsRepository.findOne.mockResolvedValue(null);

    const result = await service.activateModule(
      'project-1',
      ModuleKey.SGSI_SCOPE,
    );

    expect(result.created).toBe(true);
    expect(moduleInstancesRepository.save).toHaveBeenCalledWith({
      projectId: 'project-1',
      moduleKey: ModuleKey.SGSI_SCOPE,
    });
    expect(sgsiScopeVersionsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ versionNumber: 1 }),
    );
    expect(documentControlsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ sgsiScopeId: 'sgsi-scope-1' }),
    );
    expect(result.sgsiScope.currentVersionNumber).toBe(1);
  });

  it('is idempotent: activating twice returns the existing SgsiScope without creating a new one', async () => {
    const {
      service,
      moduleInstancesRepository,
      sgsiScopesRepository,
      documentControlsRepository,
      sgsiScopeVersionsRepository,
    } = buildService();
    moduleInstancesRepository.findOne.mockResolvedValue({
      id: 'module-instance-1',
    } as ModuleInstanceEntity);
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
      projectId: 'project-1',
      moduleInstanceId: 'module-instance-1',
    } as SgsiScopeEntity);
    sgsiScopeVersionsRepository.findOne.mockResolvedValue(null);
    documentControlsRepository.findOne.mockResolvedValue(null);

    const result = await service.activateModule(
      'project-1',
      ModuleKey.SGSI_SCOPE,
    );

    expect(result.created).toBe(false);
    expect(sgsiScopesRepository.save).not.toHaveBeenCalled();
    expect(moduleInstancesRepository.save).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when getting a scope for a project without an activated module', async () => {
    const { service, sgsiScopesRepository } = buildService();
    sgsiScopesRepository.findOne.mockResolvedValue(null);

    await expect(service.getByProjectId('project-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates only the provided DocumentControl fields (partial autosave)', async () => {
    const { service, sgsiScopesRepository, documentControlsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    documentControlsRepository.findOne.mockResolvedValue({
      id: 'document-control-1',
      sgsiScopeId: 'sgsi-scope-1',
      classification: null,
      version: null,
    } as DocumentControlEntity);

    await service.updateDocumentControl('project-1', {
      classification: 'Confidencial',
    });

    expect(documentControlsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'document-control-1',
        classification: 'Confidencial',
      }),
    );
  });

  it('throws NotFoundException when updating DocumentControl for a scope without one', async () => {
    const { service, sgsiScopesRepository, documentControlsRepository } =
      buildService();
    sgsiScopesRepository.findOne.mockResolvedValue({
      id: 'sgsi-scope-1',
    } as SgsiScopeEntity);
    documentControlsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateDocumentControl('project-1', { classification: 'Publico' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
