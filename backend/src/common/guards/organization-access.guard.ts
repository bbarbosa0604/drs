import {
  BadRequestException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';

import { OrganizationsAccessService } from '../../modules/organizations/organizations-access.service';
import { type RequestUser } from '../decorators/current-user.decorator';

/**
 * Recarrega o vinculo do usuario a cada request (nunca confia so no papel do JWT).
 * Espera a rota declarar :organizationId; controllers de Organization/Project
 * (Tasks 005/006) devem aplicar este guard depois do JwtAuthGuard.
 */
@Injectable()
export class OrganizationAccessGuard implements CanActivate {
  constructor(
    private readonly organizationsAccessService: OrganizationsAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ params: Record<string, string>; user?: RequestUser }>();
    const organizationId = request.params.organizationId;

    if (!organizationId) {
      throw new BadRequestException('organizationId route param is required.');
    }

    await this.organizationsAccessService.assertOrganizationAccess(
      request.user as RequestUser,
      organizationId,
    );

    return true;
  }
}
