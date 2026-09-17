import {
  BadRequestException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';

import { ProjectsAccessService } from '../../modules/projects/projects-access.service';
import { type RequestUser } from '../decorators/current-user.decorator';

/**
 * Recarrega o vinculo do usuario a cada request (nunca confia so no papel do JWT).
 * Espera a rota declarar :projectId; controllers de Project (Task 006) devem
 * aplicar este guard depois do JwtAuthGuard.
 */
@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(private readonly projectsAccessService: ProjectsAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ params: Record<string, string>; user?: RequestUser }>();
    const projectId = request.params.projectId;

    if (!projectId) {
      throw new BadRequestException('projectId route param is required.');
    }

    await this.projectsAccessService.assertProjectAccess(
      request.user as RequestUser,
      projectId,
    );

    return true;
  }
}
