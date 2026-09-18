import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { AuditAction } from '../../../common/enums/audit-action.enum';
import { SgsiScopeVersionStatus } from '../../../common/enums/sgsi-scope-version-status.enum';
import { type AuditLogService } from '../../audit-log/audit-log.service';
import { type ProjectEntity } from '../../projects/entities/project.entity';
import { type SgsiScopeVersionEntity } from '../entities/sgsi-scope-version.entity';
import { type SgsiScopeEntity } from '../entities/sgsi-scope.entity';
import { SgsiScopeVersioningService } from './sgsi-scope-versioning.service';

function buildRepositoryMock<T extends object>() {
  return {
    find: jest.fn<Promise<T[]>, [unknown?]>(),
    findOne: jest.fn<Promise<T | null>, [unknown]>(),
    create: jest.fn((input: Partial<T>) => input as T),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
  };
}

function buildService() {
  const sgsiScopesRepository = buildRepositoryMock<SgsiScopeEntity>();
  const versionsRepository = buildRepositoryMock<SgsiScopeVersionEntity>();
  const projectsRepository = buildRepositoryMock<ProjectEntity>();
  const auditLogService = { record: jest.fn().mockResolvedValue(undefined) };

  const service = new SgsiScopeVersioningService(
    sgsiScopesRepository as unknown as Repository<SgsiScopeEntity>,
    versionsRepository as unknown as Repository<SgsiScopeVersionEntity>,
    projectsRepository as unknown as Repository<ProjectEntity>,
    auditLogService as unknown as AuditLogService,
  );

  sgsiScopesRepository.findOne.mockResolvedValue({
    id: 'sgsi-scope-1',
  } as SgsiScopeEntity);
  projectsRepository.findOne.mockResolvedValue({
    id: 'project-1',
    organizationId: 'org-1',
  } as ProjectEntity);

  return {
    service,
    sgsiScopesRepository,
    versionsRepository,
    projectsRepository,
    auditLogService,
  };
}

describe('SgsiScopeVersioningService', () => {
  it('returns the current version as-is when it is still a draft', async () => {
    const mocks = buildService();
    mocks.versionsRepository.findOne.mockResolvedValue({
      id: 'version-1',
      versionNumber: 1,
      status: SgsiScopeVersionStatus.DRAFT,
    } as SgsiScopeVersionEntity);

    const result = await mocks.service.requestEditableVersion(
      'project-1',
      'user-1',
    );

    expect(result.id).toBe('version-1');
    expect(mocks.versionsRepository.save).not.toHaveBeenCalled();
    expect(mocks.auditLogService.record).not.toHaveBeenCalled();
  });

  it('never overwrites an approved version - creates a new draft instead (PRD secao 20/44)', async () => {
    const mocks = buildService();
    mocks.versionsRepository.findOne.mockResolvedValue({
      id: 'version-1',
      versionNumber: 1,
      status: SgsiScopeVersionStatus.APPROVED,
    } as SgsiScopeVersionEntity);

    const result = await mocks.service.requestEditableVersion(
      'project-1',
      'user-1',
    );

    expect(mocks.versionsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        sgsiScopeId: 'sgsi-scope-1',
        versionNumber: 2,
        status: SgsiScopeVersionStatus.DRAFT,
      }),
    );
    expect(result.versionNumber).toBe(2);
    expect(result.status).toBe(SgsiScopeVersionStatus.DRAFT);
    expect(mocks.auditLogService.record).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org-1',
        projectId: 'project-1',
        action: AuditAction.CREATE,
      }),
    );
  });

  it('approves the current draft version and records the audit entry', async () => {
    const mocks = buildService();
    mocks.versionsRepository.findOne.mockResolvedValue({
      id: 'version-1',
      versionNumber: 1,
      status: SgsiScopeVersionStatus.DRAFT,
    } as SgsiScopeVersionEntity);

    const result = await mocks.service.approveCurrentVersion(
      'project-1',
      'user-1',
    );

    expect(result.status).toBe(SgsiScopeVersionStatus.APPROVED);
    expect(mocks.auditLogService.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: AuditAction.APPROVED }),
    );
  });

  it('rejects approving a version that is already approved', async () => {
    const mocks = buildService();
    mocks.versionsRepository.findOne.mockResolvedValue({
      id: 'version-1',
      versionNumber: 1,
      status: SgsiScopeVersionStatus.APPROVED,
    } as SgsiScopeVersionEntity);

    await expect(
      mocks.service.approveCurrentVersion('project-1', 'user-1'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when the module has not been activated', async () => {
    const mocks = buildService();
    mocks.sgsiScopesRepository.findOne.mockResolvedValue(null);

    await expect(
      mocks.service.requestEditableVersion('project-1', 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
