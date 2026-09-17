import { BadRequestException, ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { UserRole } from '../../modules/users/entities/user.entity';
import { type OrganizationsAccessService } from '../../modules/organizations/organizations-access.service';
import { OrganizationAccessGuard } from './organization-access.guard';

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
    assertOrganizationAccess: jest.fn<Promise<void>, [unknown, string]>(),
  };
}

describe('OrganizationAccessGuard', () => {
  it('throws BadRequestException when organizationId is missing from params', async () => {
    const accessService = buildAccessServiceMock();
    const guard = new OrganizationAccessGuard(
      accessService as unknown as OrganizationsAccessService,
    );

    await expect(
      guard.canActivate(buildContext({}, { role: UserRole.MEMBER })),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(accessService.assertOrganizationAccess).not.toHaveBeenCalled();
  });

  it('blocks a consultant of Organization A trying to reach Organization B (IDOR)', async () => {
    const accessService = buildAccessServiceMock();
    accessService.assertOrganizationAccess.mockRejectedValue(
      new ForbiddenException(),
    );
    const guard = new OrganizationAccessGuard(
      accessService as unknown as OrganizationsAccessService,
    );
    const user = { userId: 'consultant-a', role: UserRole.MEMBER };

    await expect(
      guard.canActivate(buildContext({ organizationId: 'org-b' }, user)),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(accessService.assertOrganizationAccess).toHaveBeenCalledWith(
      user,
      'org-b',
    );
  });

  it('allows the request through when the access service resolves', async () => {
    const accessService = buildAccessServiceMock();
    accessService.assertOrganizationAccess.mockResolvedValue(undefined);
    const guard = new OrganizationAccessGuard(
      accessService as unknown as OrganizationsAccessService,
    );
    const user = { userId: 'admin-1', role: UserRole.ADMIN };

    await expect(
      guard.canActivate(buildContext({ organizationId: 'org-any' }, user)),
    ).resolves.toBe(true);
  });
});
