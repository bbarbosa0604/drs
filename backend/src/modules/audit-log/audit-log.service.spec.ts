import type { Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from './audit-log.service';
import { type AuditLogEntity } from './entities/audit-log.entity';

function buildRepositoryMock() {
  return {
    create: jest.fn(
      (input: Partial<AuditLogEntity>) => input as AuditLogEntity,
    ),
    save: jest.fn((entity: unknown) => Promise.resolve(entity)),
    findAndCount: jest.fn<Promise<[AuditLogEntity[], number]>, [unknown?]>(),
  };
}

describe('AuditLogService', () => {
  it('records an entry with the given organization/project/user/entity/action', async () => {
    const repository = buildRepositoryMock();
    const service = new AuditLogService(
      repository as unknown as Repository<AuditLogEntity>,
    );

    await service.record({
      organizationId: 'org-1',
      projectId: 'project-1',
      userId: 'user-1',
      entity: 'SgsiScopeVersion',
      entityId: 'version-1',
      action: AuditAction.APPROVED,
      metadata: { versionNumber: 2 },
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org-1',
        projectId: 'project-1',
        userId: 'user-1',
        entity: 'SgsiScopeVersion',
        entityId: 'version-1',
        action: AuditAction.APPROVED,
        metadata: { versionNumber: 2 },
      }),
    );
  });

  it('defaults projectId/metadata to null when omitted', async () => {
    const repository = buildRepositoryMock();
    const service = new AuditLogService(
      repository as unknown as Repository<AuditLogEntity>,
    );

    await service.record({
      organizationId: 'org-1',
      userId: 'user-1',
      entity: 'Organization',
      entityId: 'org-1',
      action: AuditAction.UPDATE,
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: null, metadata: null }),
    );
  });

  it('paginates audit log queries scoped to the organization', async () => {
    const repository = buildRepositoryMock();
    repository.findAndCount.mockResolvedValue([[], 0]);
    const service = new AuditLogService(
      repository as unknown as Repository<AuditLogEntity>,
    );

    const result = await service.findByOrganization('org-1', 2, 10);

    expect(repository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org-1' },
        skip: 10,
        take: 10,
      }),
    );
    expect(result).toEqual({ items: [], total: 0, page: 2, limit: 10 });
  });
});
