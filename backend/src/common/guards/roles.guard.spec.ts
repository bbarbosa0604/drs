import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';

import { UserRole } from '../../modules/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

function buildContext(user: { role: string } | undefined): ExecutionContext {
  return {
    getHandler: () => ({}) as unknown,
    getClass: () => ({}) as unknown,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('blocks an authenticated user without the required role (privilege escalation guard)', () => {
    const reflector = new Reflector();
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const guard = new RolesGuard(reflector);

    const context = buildContext({ role: UserRole.MEMBER });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows a user with the required role', () => {
    const reflector = new Reflector();
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const guard = new RolesGuard(reflector);

    const context = buildContext({ role: UserRole.ADMIN });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('blocks an unauthenticated request (no user on the request)', () => {
    const reflector = new Reflector();
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const guard = new RolesGuard(reflector);

    const context = buildContext(undefined);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows any authenticated user when no role is required', () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const guard = new RolesGuard(reflector);

    const context = buildContext({ role: UserRole.MEMBER });

    expect(guard.canActivate(context)).toBe(true);
    expect(ROLES_KEY).toBe('roles');
  });
});
