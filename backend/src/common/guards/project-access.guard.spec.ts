import { BadRequestException, ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { UserRole } from '../../modules/users/entities/user.entity';
import { type ProjectsAccessService } from '../../modules/projects/projects-access.service';
import { ProjectAccessGuard } from './project-access.guard';

function buildContext(
  params: Record<string, string>,
  user?: { role: string },
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ params, user }),
    }),
  } as unknown as ExecutionContext;
}

function buildAccessServiceMock() {
  return {
    assertProjectAccess: jest.fn<Promise<void>, [unknown, string]>(),
  };
}

describe('ProjectAccessGuard', () => {
  it('throws BadRequestException when projectId is missing from params', async () => {
    const accessService = buildAccessServiceMock();
    const guard = new ProjectAccessGuard(
      accessService as unknown as ProjectsAccessService,
    );

    await expect(
      guard.canActivate(buildContext({}, { role: UserRole.MEMBER })),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(accessService.assertProjectAccess).not.toHaveBeenCalled();
  });

  it('blocks a consultant of Project A trying to reach Project B (IDOR)', async () => {
    const accessService = buildAccessServiceMock();
    accessService.assertProjectAccess.mockRejectedValue(
      new ForbiddenException(),
    );
    const guard = new ProjectAccessGuard(
      accessService as unknown as ProjectsAccessService,
    );
    const user = { userId: 'consultant-a', role: UserRole.MEMBER };

    await expect(
      guard.canActivate(buildContext({ projectId: 'project-b' }, user)),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(accessService.assertProjectAccess).toHaveBeenCalledWith(
      user,
      'project-b',
    );
  });

  it('allows the request through when the access service resolves', async () => {
    const accessService = buildAccessServiceMock();
    accessService.assertProjectAccess.mockResolvedValue(undefined);
    const guard = new ProjectAccessGuard(
      accessService as unknown as ProjectsAccessService,
    );
    const user = { userId: 'admin-1', role: UserRole.ADMIN };

    await expect(
      guard.canActivate(buildContext({ projectId: 'project-any' }, user)),
    ).resolves.toBe(true);
  });
});
